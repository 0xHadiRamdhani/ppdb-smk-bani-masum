import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const bucket = "registration-documents";
const maxFileSize = 2 * 1024 * 1024;
const documentFields = ["kk", "ijazah", "photo"] as const;

function getSupabase() {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) throw new Error("Konfigurasi Supabase belum lengkap.");
    return createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

function isAllowedFile(file: FormDataEntryValue | null): file is File {
    return file instanceof File
        && file.size > 0
        && file.size <= maxFileSize
        && ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
}

export async function GET(request: Request) {
    const number = new URL(request.url).searchParams.get("number")?.trim().toUpperCase();
    if (!number || !/^BM26-[A-F0-9]{16}$/.test(number)) {
        return Response.json({ error: "Nomor pendaftaran tidak valid." }, { status: 400 });
    }

    const { data, error } = await getSupabase()
        .from("registrations")
        .select("registration_number, name, status")
        .eq("registration_number", number)
        .maybeSingle();
    if (error) {
        console.error("Failed to look up registration", error);
        return Response.json({ error: "Status pendaftaran belum dapat diperiksa." }, { status: 500 });
    }
    if (!data) return Response.json({ error: "Nomor pendaftaran tidak ditemukan." }, { status: 404 });

    return Response.json({ registration: { number: data.registration_number, name: data.name, status: data.status } });
}

export async function POST(request: Request) {
    const form = await request.formData();
    const fields = ["name", "nisn", "birth", "phone", "parentName", "parentPhone", "major"] as const;
    const values = Object.fromEntries(fields.map((field) => [field, form.get(field)?.toString().trim() ?? ""]));
    const files = Object.fromEntries(documentFields.map((field) => [field, form.get(field)])) as Record<typeof documentFields[number], FormDataEntryValue | null>;

    if (fields.some((field) => !values[field])) {
        return Response.json({ error: "Lengkapi semua data pendaftaran." }, { status: 400 });
    }
    if (documentFields.some((field) => !isAllowedFile(files[field]))) {
        return Response.json({ error: "Setiap dokumen wajib berupa PDF/JPG/PNG maksimal 2 MB." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: inserted, error: insertError } = await supabase
        .from("registrations")
        .insert({
            name: values.name,
            nisn: values.nisn,
            birth_date: values.birth,
            phone: values.phone,
            parent_name: values.parentName,
            parent_phone: values.parentPhone,
            major: values.major,
        })
        .select("id, registration_number, name, status")
        .single();

    if (insertError || !inserted) {
        console.error("Failed to create registration", insertError);
        return Response.json({ error: "Data pendaftaran belum dapat disimpan. Silakan coba lagi." }, { status: 500 });
    }

    const uploadedPaths: string[] = [];
    const documentPaths: Record<string, string> = {};
    for (const field of documentFields) {
        const file = files[field] as File;
        const path = `${inserted.registration_number}/${field}-${crypto.randomUUID()}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
            contentType: file.type,
            upsert: false,
        });
        if (error) {
            console.error("Failed to upload registration document", error);
            await supabase.from("registrations").delete().eq("id", inserted.id);
            if (uploadedPaths.length) await supabase.storage.from(bucket).remove(uploadedPaths);
            return Response.json({ error: "Dokumen gagal diunggah. Silakan coba lagi." }, { status: 500 });
        }
        uploadedPaths.push(path);
        documentPaths[`${field}_path`] = path;
    }

    const { error: updateError } = await supabase
        .from("registrations")
        .update(documentPaths)
        .eq("id", inserted.id);
    if (updateError) {
        console.error("Failed to save registration document paths", updateError);
        await supabase.from("registrations").delete().eq("id", inserted.id);
        await supabase.storage.from(bucket).remove(uploadedPaths);
        return Response.json({ error: "Dokumen gagal ditautkan ke pendaftaran. Silakan coba lagi." }, { status: 500 });
    }

    return Response.json({ number: inserted.registration_number }, { status: 201 });
}