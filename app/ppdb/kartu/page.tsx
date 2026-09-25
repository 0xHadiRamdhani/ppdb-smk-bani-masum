"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

type Registration = { number: string; name: string; status: string };

function RegistrationCardContent() {
    const searchParams = useSearchParams();
    const number = searchParams.get("number")?.toUpperCase() ?? "";
    const [registration, setRegistration] = useState<Registration | null>(null);
    useEffect(() => { if (!number) return; const saved = localStorage.getItem(`ppdb:${number}`); if (saved) setRegistration(JSON.parse(saved) as Registration); }, [number]);
    if (!number || !registration) return <SubpageShell eyebrow="Kartu Pendaftaran" title="Data Tidak Ditemukan" intro="Buka halaman ini dari konfirmasi pendaftaran atau masukkan nomor pendaftaran yang benar."><section className="mx-auto max-w-xl px-5 py-14 sm:px-8"><Panel><Link href="/ppdb/daftar" className="inline-flex border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Kembali ke Pendaftaran</Link></Panel></section></SubpageShell>;
    const qrUrl = `https://quickchart.io/qr?size=180&text=${encodeURIComponent(`PPDB SMK Bani Masum - ${registration.number}`)}`;
    return <SubpageShell eyebrow="Kartu Pendaftaran" title="Kartu Peserta PPDB" intro="Simpan atau cetak kartu ini sebagai bukti pendaftaran sementara."><section className="mx-auto max-w-2xl px-5 py-14 sm:px-8"><Panel><div className="border-[3px] border-primary bg-paper-soft p-6 sm:p-8"><div className="flex items-start justify-between gap-4 border-b-2 border-primary pb-5"><div><p className="text-xs font-extrabold uppercase tracking-wide text-primary">PPDB 2026/2027</p><h2 className="mt-2 font-display text-3xl">SMK BANI MASUM</h2></div><img src={qrUrl} alt="QR code kartu pendaftaran" width={90} height={90} className="h-[90px] w-[90px] border-2 border-primary bg-white p-1" /></div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-bold text-neutral-600">Nomor pendaftaran</dt><dd className="mt-1 font-display text-2xl">{registration.number}</dd></div><div><dt className="font-bold text-neutral-600">Nama peserta</dt><dd className="mt-1 font-bold">{registration.name}</dd></div><div><dt className="font-bold text-neutral-600">Status</dt><dd className="mt-1 font-bold text-primary">{registration.status}</dd></div><div><dt className="font-bold text-neutral-600">Tanggal cetak</dt><dd className="mt-1">{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date())}</dd></div></dl></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => window.print()} className="border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Cetak Kartu</button><Link href="/ppdb/cek-status" className="border-[3px] border-primary px-5 py-3 text-center font-bold text-primary">Cek Status</Link></div></Panel></section></SubpageShell>;
}

export default function RegistrationCardPage() { return <Suspense fallback={<SubpageShell eyebrow="Kartu Pendaftaran" title="Memuat Kartu..."><section className="mx-auto max-w-xl px-5 py-14 sm:px-8"><Panel><p>Menyiapkan kartu pendaftaran.</p></Panel></section></SubpageShell>}><RegistrationCardContent /></Suspense>; }
