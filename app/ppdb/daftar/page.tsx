"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";
import { StepIndicator, TextField, UploadField } from "./form-fields";

const steps = ["Data Diri", "Orang Tua", "Jurusan", "Dokumen"];
const personalFields = [
    ["name", "Nama lengkap", "text"],
    ["nisn", "NISN", "text"],
    ["birth", "Tanggal lahir", "date"],
    ["phone", "No. HP calon siswa", "tel"],
] as const;
const documentFields = [
    ["kk", "Kartu Keluarga"],
    ["ijazah", "Ijazah / SKL"],
    ["photo", "Pas foto"],
] as const;

type Draft = Record<string, string>;

function RegistrationSuccess({ number }: { number: string }) {
    return <SubpageShell eyebrow="Pendaftaran Berhasil" title="Simpan Nomor Pendaftaranmu">
        <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
            <Panel>
                <p className="text-neutral-700">Nomor pendaftaran kamu:</p>
                <div className="my-5 border-[3px] border-primary bg-paper-soft p-5 text-center font-display text-4xl">{number}</div>
                <p className="leading-7">Gunakan nomor ini untuk cek status berkas atau membuka kartu pendaftaran.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link href={`/ppdb/kartu?number=${number}`} className="inline-flex border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Cetak Kartu Pendaftaran</Link>
                    <Link href="/ppdb/cek-status" className="inline-flex border-[3px] border-primary px-5 py-3 font-bold text-primary">Cek Status</Link>
                </div>
            </Panel>
        </section>
    </SubpageShell>;
}

export default function RegisterPage() {
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState<Draft>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [submittedNumber, setSubmittedNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            window.alert("Ukuran file maksimal 2 MB.");
            return;
        }
        if (!file.type.includes("pdf") && !file.type.includes("image")) {
            window.alert("File harus berupa PDF atau gambar.");
            return;
        }
        setFiles((current) => ({ ...current, [event.target.name]: file }));
    };

    const handleNext = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formValues = Object.fromEntries(
            Array.from(new FormData(event.currentTarget).entries())
                .filter((entry): entry is [string, string] => typeof entry[1] === "string"),
        );
        const nextDraft = { ...draft, ...formValues };
        setDraft(nextDraft);
        if (step < steps.length - 1) {
            setStep((current) => current + 1);
            return;
        }
        setSubmitting(true);
        setFormError("");
        try {
            const payload = new FormData();
            Object.entries(nextDraft).forEach(([key, value]) => payload.append(key, value));
            Object.entries(files).forEach(([key, file]) => payload.append(key, file));
            const response = await fetch("/api/pendaftaran", { method: "POST", body: payload });
            const result = await response.json() as { number?: string; error?: string };
            if (!response.ok || !result.number) throw new Error(result.error || "Pendaftaran gagal dikirim.");
            setSubmittedNumber(result.number);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Pendaftaran gagal dikirim. Coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submittedNumber) return <RegistrationSuccess number={submittedNumber} />;

    return <SubpageShell eyebrow="Formulir Online" title="Daftar sebagai Siswa Baru" intro="Isi data dengan benar. Kamu bisa berpindah langkah menggunakan tombol di bawah.">
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
            <StepIndicator steps={steps} currentStep={step} />
            <Panel>
                <form onSubmit={handleNext} className="space-y-5">
                    {step === 0 && personalFields.map(([name, label, type]) => <TextField key={name} name={name} label={label} type={type} />)}
                    {step === 1 && <>
                        <TextField name="parentName" label="Nama orang tua / wali" />
                        <TextField name="parentPhone" label="No. HP orang tua" type="tel" />
                    </>}
                    {step === 2 && <label className="block text-sm font-bold">Pilihan jurusan
                        <select required name="major" className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal">
                            <option value="">Pilih jurusan</option>
                            <option>RPL - Teknik Komputer</option>
                            <option>TBSM - Teknik Otomotif</option>
                        </select>
                    </label>}
                    {step === 3 && <div className="space-y-4">
                        {documentFields.map(([name, label]) => <UploadField key={name} name={name} label={label} filename={files[name]?.name} onChange={handleUpload} />)}
                        <p className="text-xs text-neutral-600">Format PDF/JPG/PNG, ukuran maksimal 2 MB per file.</p>
                    </div>}
                    {formError && <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">{formError}</p>}
                    <div className="flex justify-between gap-4 pt-4">
                        {step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)} className="border-[3px] border-ink bg-paper px-5 py-3 font-bold comic-shadow">Kembali</button>}
                        <button type="submit" disabled={submitting} className="ml-auto border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow disabled:cursor-wait disabled:opacity-60">{submitting ? "Mengirim..." : step === steps.length - 1 ? "Kirim Pendaftaran" : "Lanjut"}</button>
                    </div>
                </form>
            </Panel>
        </section>
    </SubpageShell>;
}
