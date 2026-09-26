"use client";

import { FormEvent, useState } from "react";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

export default function StatusPage() {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const check = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const number = new FormData(event.currentTarget).get("number")?.toString().trim().toUpperCase() ?? "";
        setLoading(true);
        try {
            const response = await fetch(`/api/pendaftaran?number=${encodeURIComponent(number)}`);
            const data = await response.json() as { registration?: { status: string }; error?: string };
            setResult(response.ok ? data.registration?.status ?? "Status belum tersedia." : data.error ?? "Nomor belum ditemukan.");
        } catch {
            setResult("Status belum dapat diperiksa. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return <SubpageShell eyebrow="Pelacakan Pendaftaran" title="Cek Status Berkas" intro="Masukkan nomor pendaftaran yang kamu dapat setelah mengirim formulir."><section className="mx-auto max-w-xl px-5 py-14 sm:px-8"><Panel><form onSubmit={check}><label className="block text-sm font-bold">Nomor pendaftaran<input required name="number" placeholder="Contoh: BM26-1A2B3C4D5E6F7890" className="mt-2 block w-full border-[3px] border-ink px-4 py-3 uppercase outline-none" /></label><button disabled={loading} className="mt-6 w-full border-[3px] border-ink bg-ink px-5 py-3 font-bold text-paper comic-shadow disabled:opacity-60">{loading ? "Memeriksa..." : "Lihat Status"}</button></form>{result && <div className="mt-7 border-[3px] border-ink bg-paper-soft p-5"><p className="text-sm font-bold">Status pendaftaran</p><p className="mt-2 font-display text-3xl">{result}</p></div>}</Panel></section></SubpageShell>;
}
