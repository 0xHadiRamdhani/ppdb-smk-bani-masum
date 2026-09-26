"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

type Registration = {
    registration_number: string;
    name: string;
    nisn: string;
    phone: string;
    parent_name: string;
    parent_phone: string;
    major: string;
    status: string;
    created_at: string;
};

type RegistrationDetail = Registration & { birth_date: string };
type DocumentLink = { name: string; url: string | null };
const statuses = ["Menunggu verifikasi", "Diterima", "Revisi berkas"];
const statusFilters = ["Semua", ...statuses];
const majorFilters = ["Semua", "RPL", "TBSM"];

function escapeCsv(value: string) {
    const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return `"${safeValue.replaceAll('"', '""')}"`;
}

export default function AdminPage() {
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [majorFilter, setMajorFilter] = useState("Semua");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [savingNumber, setSavingNumber] = useState("");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [savingNewRegistration, setSavingNewRegistration] = useState(false);
    const [addError, setAddError] = useState("");
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationDetail | null>(null);
    const [documents, setDocuments] = useState<DocumentLink[]>([]);
    const [reload, setReload] = useState(0);
    const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
    const [addDialog, setAddDialog] = useState<HTMLDialogElement | null>(null);

    useEffect(() => {
        let active = true;
        fetch("/api/admin/pendaftar", { cache: "no-store" })
            .then(async (response) => {
                const result = await response.json() as { registrations?: Registration[]; error?: string };
                if (response.status === 401) {
                    router.replace("/admin/login");
                    return;
                }
                if (!response.ok) throw new Error(result.error || "Data pendaftar gagal dimuat.");
                if (active) setRegistrations(result.registrations ?? []);
            })
            .catch((fetchError: unknown) => {
                if (active) setError(fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan saat memuat data.");
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [reload, router]);

    useEffect(() => {
        if (!dialog) return;
        if (selectedRegistration && !dialog.open) dialog.showModal();
        if (!selectedRegistration && dialog.open) dialog.close();
    }, [dialog, selectedRegistration]);

    useEffect(() => {
        if (!addDialog) return;
        if (addDialogOpen && !addDialog.open) addDialog.showModal();
        if (!addDialogOpen && addDialog.open) addDialog.close();
    }, [addDialog, addDialogOpen]);

    const visibleRegistrations = registrations.filter((registration) => {
        const matchesStatus = statusFilter === "Semua" || registration.status === statusFilter;
        const matchesMajor = majorFilter === "Semua" || registration.major.split(" - ")[0] === majorFilter;
        const searchable = `${registration.registration_number} ${registration.name} ${registration.nisn} ${registration.major}`.toLowerCase();
        return matchesStatus && matchesMajor && searchable.includes(query.trim().toLowerCase());
    });

    const openDetails = async (number: string) => {
        setLoadingDetails(true);
        setError("");
        try {
            const response = await fetch(`/api/admin/pendaftar?number=${encodeURIComponent(number)}`, { cache: "no-store" });
            const result = await response.json() as { registration?: RegistrationDetail; documents?: DocumentLink[]; error?: string };
            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }
            if (!response.ok || !result.registration) throw new Error(result.error || "Detail pendaftar gagal dimuat.");
            setSelectedRegistration(result.registration);
            setDocuments(result.documents ?? []);
        } catch (detailError) {
            setError(detailError instanceof Error ? detailError.message : "Detail pendaftar gagal dimuat.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const updateStatus = async (number: string, status: string) => {
        setSavingNumber(number);
        setError("");
        try {
            const response = await fetch("/api/admin/pendaftar", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number, status }),
            });
            const result = await response.json() as { error?: string };
            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }
            if (!response.ok) throw new Error(result.error || "Status gagal diperbarui.");
            setRegistrations((current) => current.map((item) => item.registration_number === number ? { ...item, status } : item));
            setSelectedRegistration((current) => current?.registration_number === number ? { ...current, status } : current);
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : "Status gagal diperbarui.");
        } finally {
            setSavingNumber("");
        }
    };

    const addRegistration = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSavingNewRegistration(true);
        setAddError("");
        const form = event.currentTarget;
        try {
            const response = await fetch("/api/admin/pendaftar", {
                method: "POST",
                body: new FormData(form),
            });
            const result = await response.json() as { registration?: Registration; error?: string };
            if (response.status === 401) {
                router.replace("/admin/login");
                return;
            }
            if (!response.ok || !result.registration) throw new Error(result.error || "Pendaftar gagal ditambahkan.");
            setRegistrations((current) => [result.registration!, ...current]);
            setNotice(`${result.registration.name} berhasil ditambahkan.`);
            setError("");
            setAddDialogOpen(false);
            form.reset();
        } catch (addError) {
            setAddError(addError instanceof Error ? addError.message : "Pendaftar gagal ditambahkan.");
        } finally {
            setSavingNewRegistration(false);
        }
    };

    const signOut = async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        router.replace("/admin/login");
        router.refresh();
    };

    const exportCsv = () => {
        const columns = ["Nomor", "Nama", "NISN", "Jurusan", "Telepon", "Nama Wali", "Telepon Wali", "Status", "Tanggal Daftar"];
        const rows = visibleRegistrations.map((item) => [item.registration_number, item.name, item.nisn, item.major, item.phone, item.parent_name, item.parent_phone, item.status, item.created_at]);
        const csv = [columns, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "pendaftar-ppdb.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const summaries = statuses.map((status) => [status, registrations.filter((item) => item.status === status).length] as const);

    return <SubpageShell eyebrow="Administrasi PPDB" title="Data Pendaftar" intro="Daftar pendaftar yang tersimpan di Supabase.">
        <section className="mx-auto max-w-7xl space-y-6 px-5 py-10 sm:px-8 sm:py-14">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Panel><p className="font-display text-4xl text-primary">{loading ? "..." : registrations.length}</p><p className="mt-1 text-sm font-bold">Total pendaftar</p></Panel>
                {summaries.map(([status, count]) => <Panel key={status}><p className="font-display text-4xl text-primary">{loading ? "..." : count}</p><p className="mt-1 text-sm font-bold">{status}</p></Panel>)}
            </div>
            <Panel>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-2xl">Daftar Pendaftar</h2>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => { setAddError(""); setAddDialogOpen(true); }} className="border-[3px] border-primary bg-primary px-4 py-2 text-sm font-bold text-paper comic-shadow">Tambah Pendaftar</button>
                        <button type="button" onClick={() => setReload((value) => value + 1)} disabled={loading} className="border-[3px] border-ink px-4 py-2 text-sm font-bold hover:bg-paper-soft disabled:opacity-60">Muat ulang</button>
                        <button type="button" onClick={exportCsv} disabled={!visibleRegistrations.length} className="border-[3px] border-primary bg-primary px-4 py-2 text-sm font-bold text-paper comic-shadow disabled:opacity-60">Export CSV</button>
                        <button type="button" onClick={() => void signOut()} className="border-[3px] border-ink px-4 py-2 text-sm font-bold hover:bg-paper-soft">Keluar</button>
                    </div>
                </div>
                {notice && <p role="status" className="mt-5 border-2 border-green-700 bg-green-50 p-3 text-sm font-bold text-green-800">{notice}</p>}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor, nama, NISN" className="min-w-0 border-[3px] border-ink bg-paper px-4 py-3 text-sm" aria-label="Cari pendaftar" />
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border-[3px] border-ink bg-paper px-4 py-3 text-sm font-bold" aria-label="Filter status">{statusFilters.map((status) => <option key={status}>{status}</option>)}</select>
                    <select value={majorFilter} onChange={(event) => setMajorFilter(event.target.value)} className="border-[3px] border-ink bg-paper px-4 py-3 text-sm font-bold" aria-label="Filter jurusan">{majorFilters.map((major) => <option key={major}>{major}</option>)}</select>
                </div>
                {error && <p role="alert" className="mt-5 border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">{error}</p>}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-225 border-collapse text-left text-sm">
                        <thead className="bg-primary text-paper"><tr><th className="p-3">Nomor / Tanggal</th><th className="p-3">Pendaftar</th><th className="p-3">Jurusan</th><th className="p-3">Telepon</th><th className="p-3">Status</th><th className="p-3">Detail</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan={6} className="p-8 text-center text-neutral-600">Memuat data pendaftar...</td></tr>
                                : visibleRegistrations.map((registration) => <tr key={registration.registration_number} className="border-b-2 border-primary/20 align-top">
                                    <td className="p-3"><p className="font-bold">{registration.registration_number}</p><p className="mt-1 text-xs text-neutral-600">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(registration.created_at))}</p></td>
                                    <td className="p-3"><p className="font-bold">{registration.name}</p><p className="mt-1 text-xs text-neutral-600">NISN: {registration.nisn}</p></td>
                                    <td className="p-3">{registration.major}</td>
                                    <td className="p-3">{registration.phone}</td>
                                    <td className="p-3"><select value={registration.status} disabled={savingNumber === registration.registration_number} onChange={(event) => void updateStatus(registration.registration_number, event.target.value)} className="max-w-52 border-2 border-primary bg-paper px-2 py-2 text-xs font-bold disabled:opacity-60" aria-label={`Ubah status ${registration.registration_number}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
                                    <td className="p-3"><button type="button" disabled={loadingDetails} onClick={() => void openDetails(registration.registration_number)} className="border-2 border-primary px-3 py-2 text-xs font-bold text-primary hover:bg-primary-soft disabled:opacity-60">{loadingDetails ? "Memuat..." : "Lihat"}</button></td>
                                </tr>)}
                            {!loading && visibleRegistrations.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-neutral-600">Tidak ada pendaftar yang cocok.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-neutral-600">Menampilkan {visibleRegistrations.length} dari {registrations.length} pendaftar.</p>
            </Panel>
        </section>

        <dialog ref={setAddDialog} onCancel={() => setAddDialogOpen(false)} onClick={(event) => { if (event.target === addDialog) setAddDialogOpen(false); }} className="m-auto max-h-[min(90dvh,850px)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto border-[3px] border-primary bg-paper p-0 text-ink backdrop:bg-ink/70" aria-labelledby="add-registration-title">
            <form onSubmit={addRegistration} className="divide-y-[3px] divide-primary">
                <div className="flex items-start justify-between gap-4 bg-primary-soft p-5 sm:p-7">
                    <div><p className="text-xs font-extrabold uppercase text-primary">Entri Manual</p><h2 id="add-registration-title" className="mt-1 font-display text-3xl">Tambah Pendaftar</h2></div>
                    <button type="button" onClick={() => setAddDialogOpen(false)} aria-label="Tutup form tambah pendaftar" className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary text-2xl font-bold text-primary hover:bg-paper">×</button>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                    <label className="block text-sm font-bold sm:col-span-2">Nama lengkap<input required name="name" maxLength={120} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                    <label className="block text-sm font-bold">NISN<input required name="nisn" inputMode="numeric" maxLength={20} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                    <label className="block text-sm font-bold">Tanggal lahir<input required name="birth_date" type="date" className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                    <label className="block text-sm font-bold">Telepon pendaftar<input required name="phone" type="tel" maxLength={30} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                    <label className="block text-sm font-bold">Jurusan<select required name="major" defaultValue="" className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal"><option value="" disabled>Pilih jurusan</option><option value="RPL - Teknik Komputer">RPL - Teknik Komputer</option><option value="TBSM - Teknik Otomotif">TBSM - Teknik Otomotif</option></select></label>
                    <label className="block text-sm font-bold">Nama orang tua / wali<input required name="parent_name" maxLength={120} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                    <label className="block text-sm font-bold">Telepon orang tua / wali<input required name="parent_phone" type="tel" maxLength={30} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal" /></label>
                </div>
                <div className="space-y-4 p-5 sm:p-7">
                    <h3 className="font-extrabold">Dokumen (opsional)</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[["kk", "Kartu Keluarga"], ["ijazah", "Ijazah / SKL"], ["photo", "Pas foto"]].map(([name, label]) => <label key={name} className="block text-sm font-bold">{label}<input name={name} type="file" accept=".pdf,image/jpeg,image/png" className="mt-2 block w-full min-w-0 border-2 border-ink p-2 text-xs font-normal" /></label>)}
                    </div>
                    <p className="text-xs text-neutral-600">PDF/JPG/PNG, maksimal 2 MB per dokumen.</p>
                    {addError && <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">{addError}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setAddDialogOpen(false)} className="border-[3px] border-ink px-4 py-3 text-sm font-bold">Batal</button>
                        <button type="submit" disabled={savingNewRegistration} className="border-[3px] border-primary bg-primary px-5 py-3 text-sm font-bold text-paper comic-shadow disabled:opacity-60">{savingNewRegistration ? "Menyimpan..." : "Simpan Pendaftar"}</button>
                    </div>
                </div>
            </form>
        </dialog>

        <dialog ref={setDialog} onCancel={() => setSelectedRegistration(null)} onClick={(event) => { if (event.target === dialog) setSelectedRegistration(null); }} className="m-auto max-h-[min(90dvh,800px)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto border-[3px] border-primary bg-paper p-0 text-ink backdrop:bg-ink/70" aria-labelledby="registration-detail-title">
            {selectedRegistration && <>
                <div className="flex items-start justify-between gap-4 border-b-[3px] border-primary bg-primary-soft p-5 sm:p-7">
                    <div><p className="font-display text-3xl text-primary">{selectedRegistration.registration_number}</p><h2 id="registration-detail-title" className="mt-1 text-xl font-extrabold">{selectedRegistration.name}</h2></div>
                    <button type="button" onClick={() => setSelectedRegistration(null)} aria-label="Tutup detail pendaftar" className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary text-2xl font-bold text-primary hover:bg-paper">×</button>
                </div>
                <div className="space-y-6 p-5 sm:p-7">
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                        <div><dt className="font-bold text-neutral-600">NISN</dt><dd className="mt-1">{selectedRegistration.nisn}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Tanggal lahir</dt><dd className="mt-1">{selectedRegistration.birth_date}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Telepon pendaftar</dt><dd className="mt-1">{selectedRegistration.phone}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Jurusan</dt><dd className="mt-1">{selectedRegistration.major}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Nama orang tua / wali</dt><dd className="mt-1">{selectedRegistration.parent_name}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Telepon orang tua / wali</dt><dd className="mt-1">{selectedRegistration.parent_phone}</dd></div>
                        <div><dt className="font-bold text-neutral-600">Status</dt><dd className="mt-1">{selectedRegistration.status}</dd></div>
                    </dl>
                    <section><h3 className="font-extrabold text-primary">Dokumen pendaftaran</h3><div className="mt-3 flex flex-wrap gap-3">{documents.map((document) => document.url
                        ? <a key={document.name} href={document.url} target="_blank" rel="noreferrer" className="border-2 border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary-soft">Buka {document.name}</a>
                        : <span key={document.name} className="border-2 border-neutral-300 px-4 py-2 text-sm text-neutral-500">{document.name} belum tersedia</span>)}</div><p className="mt-2 text-xs text-neutral-600">Tautan dokumen berlaku selama 5 menit.</p></section>
                </div>
            </>}
        </dialog>
    </SubpageShell>;
}