import { createClient } from "@supabase/supabase-js";
import { hasAdminSession } from "@/app/lib/admin-auth";

export const runtime = "nodejs";

const bucket = "registration-documents";
const statuses = ["Menunggu verifikasi", "Diterima", "Revisi berkas"];
const majors = ["RPL - Teknik Komputer", "TBSM - Teknik Otomotif"];
const documentFields = [
    ["kk", "kk_path"],
    ["ijazah", "ijazah_path"],
    ["photo", "photo_path"],
] as const;
const maxFileSize = 2 * 1024 * 1024;

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) throw new Error("Konfigurasi Supabase server belum lengkap.");
    return createClient(url, secretKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

export async function GET(request: Request) {
    if (!await hasAdminSession()) {
        return Response.json({ error: "Silakan login untuk melihat data pendaftar." }, { status: 401 });
    }

    const number = new URL(request.url).searchParams.get("number")?.trim().toUpperCase();
    const supabase = getSupabase();
    if (number) {
        const { data, error } = await supabase
            .from("registrations")
            .select("registration_number, name, nisn, birth_date, phone, parent_name, parent_phone, major, status, created_at, kk_path, ijazah_path, photo_path")
            .eq("registration_number", number)
            .maybeSingle();
        if (error) {
            console.error("Failed to load registration details", error);
            return Response.json({ error: "Detail pendaftar belum dapat dimuat." }, { status: 500 });
        }
        if (!data) return Response.json({ error: "Pendaftar tidak ditemukan." }, { status: 404 });

        const documentEntries = [
            ["Kartu Keluarga", data.kk_path],
            ["Ijazah / SKL", data.ijazah_path],
            ["Pas foto", data.photo_path],
        ] as const;
        const documents = await Promise.all(documentEntries.map(async ([name, path]) => {
            if (!path) return { name, url: null };
            const { data: signed, error: signedError } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
            if (signedError) console.error("Failed to create registration document link", signedError);
            return { name, url: signed?.signedUrl ?? null };
        }));
        const registration = {
            registration_number: data.registration_number,
            name: data.name,
            nisn: data.nisn,
            birth_date: data.birth_date,
            phone: data.phone,
            parent_name: data.parent_name,
            parent_phone: data.parent_phone,
            major: data.major,
            status: data.status,
            created_at: data.created_at,
        };
        return Response.json({ registration, documents }, { headers: { "Cache-Control": "private, no-store" } });
    }

    const { data, error } = await supabase
        .from("registrations")
        .select("registration_number, name, nisn, phone, parent_name, parent_phone, major, status, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

    if (error) {
        console.error("Failed to load admin registrations", error);
        return Response.json({ error: "Data pendaftar belum dapat dimuat." }, { status: 500 });
    }
    return Response.json({ registrations: data ?? [] }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
    if (!await hasAdminSession()) {
        return Response.json({ error: "Silakan login untuk menambahkan pendaftar." }, { status: 401 });
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
    }

    const fields = ["name", "nisn", "birth_date", "phone", "parent_name", "parent_phone", "major"] as const;
    const values = Object.fromEntries(fields.map((field) => [field, form.get(field)?.toString().trim() ?? ""]));
    if (fields.some((field) => !values[field])) {
        return Response.json({ error: "Lengkapi semua data wajib pendaftar." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.birth_date) || Number.isNaN(Date.parse(values.birth_date))) {
        return Response.json({ error: "Tanggal lahir tidak valid." }, { status: 400 });
    }
    if (!majors.includes(values.major)) {
        return Response.json({ error: "Pilihan jurusan tidak valid." }, { status: 400 });
    }

    const files = documentFields.map(([field, pathField]) => {
        const entry = form.get(field);
        const file = entry instanceof File && entry.size > 0 ? entry : null;
        return { field, pathField, file };
    });
    for (const { file } of files) {
        if (file && (file.size > maxFileSize || !["application/pdf", "image/jpeg", "image/png"].includes(file.type))) {
            return Response.json({ error: "Dokumen harus PDF/JPG/PNG dan berukuran maksimal 2 MB." }, { status: 400 });
        }
    }

    const supabase = getSupabase();
    const { data: inserted, error: insertError } = await supabase
        .from("registrations")
        .insert({
            ...values,
            status: "Menunggu verifikasi",
        })
        .select("id, registration_number, name, nisn, phone, parent_name, parent_phone, major, status, created_at")
        .single();

    if (insertError || !inserted) {
        console.error("Failed to add registration", insertError);
        return Response.json({ error: "Data pendaftar gagal disimpan." }, { status: 500 });
    }

    const uploadedPaths: string[] = [];
    const documentPaths: Record<string, string> = {};
    for (const { field, pathField, file } of files) {
        if (!file) continue;
        const path = `${inserted.registration_number}/${field}-${crypto.randomUUID()}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
            contentType: file.type,
            upsert: false,
        });
        if (error) {
            console.error("Failed to upload new applicant document", error);
            await supabase.from("registrations").delete().eq("id", inserted.id);
            if (uploadedPaths.length) await supabase.storage.from(bucket).remove(uploadedPaths);
            return Response.json({ error: "Dokumen gagal diunggah; data pendaftar dibatalkan." }, { status: 500 });
        }
        uploadedPaths.push(path);
        documentPaths[pathField] = path;
    }

    if (uploadedPaths.length) {
        const { error } = await supabase.from("registrations").update(documentPaths).eq("id", inserted.id);
        if (error) {
            console.error("Failed to save new applicant document paths", error);
            await supabase.from("registrations").delete().eq("id", inserted.id);
            await supabase.storage.from(bucket).remove(uploadedPaths);
            return Response.json({ error: "Dokumen gagal ditautkan; data pendaftar dibatalkan." }, { status: 500 });
        }
    }

    return Response.json({ registration: inserted }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: Request) {
    if (!await hasAdminSession()) {
        return Response.json({ error: "Silakan login untuk mengubah data pendaftar." }, { status: 401 });
    }

    let body: { number?: unknown; status?: unknown };
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
    }
    if (typeof body.number !== "string" || !/^BM26-[A-F0-9]{16}$/.test(body.number)
        || typeof body.status !== "string" || !statuses.includes(body.status)) {
        return Response.json({ error: "Nomor atau status pendaftar tidak valid." }, { status: 400 });
    }

    const { data, error } = await getSupabase()
        .from("registrations")
        .update({ status: body.status })
        .eq("registration_number", body.number)
        .select("registration_number, status")
        .maybeSingle();
    if (error) {
        console.error("Failed to update registration status", error);
        return Response.json({ error: "Status pendaftar gagal diperbarui." }, { status: 500 });
    }
    if (!data) return Response.json({ error: "Pendaftar tidak ditemukan." }, { status: 404 });
    return Response.json({ registration: data }, { headers: { "Cache-Control": "private, no-store" } });
}