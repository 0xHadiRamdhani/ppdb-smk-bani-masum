"use client";

import { FormEvent, useState } from "react";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

export default function PaymentPage() {
    const [saved, setSaved] = useState(false);
    const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); localStorage.setItem("ppdb:payment", "Menunggu verifikasi pembayaran"); setSaved(true); };
    return <SubpageShell eyebrow="Pembayaran PPDB" title="Konfirmasi Biaya Pendaftaran" intro="Fitur ini menyiapkan alur pembayaran. Hubungkan payment gateway sekolah sebelum digunakan di produksi."><section className="mx-auto max-w-2xl px-5 py-14 sm:px-8"><Panel><div className="border-[3px] border-primary bg-paper-soft p-5"><p className="text-sm font-bold text-primary">Biaya pendaftaran</p><p className="mt-2 font-display text-4xl">Rp150.000</p><p className="mt-2 text-sm leading-6 text-neutral-700">Transfer ke rekening sekolah atau gunakan kanal pembayaran yang diinformasikan panitia.</p></div>{saved ? <div className="mt-6 border-[3px] border-primary p-5"><p className="font-bold text-primary">Bukti pembayaran sudah dikirim.</p><p className="mt-2 text-sm text-neutral-700">Status: Menunggu verifikasi panitia.</p></div> : <form onSubmit={submit} className="mt-6 space-y-5"><label className="block text-sm font-bold">Nomor pendaftaran<input required name="number" placeholder="BM26-123456" className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 uppercase" /></label><label className="block text-sm font-bold">Bukti transfer<input required type="file" accept="image/*,.pdf" className="mt-2 block w-full border-[3px] border-ink p-3 font-normal" /></label><button className="w-full border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Kirim Bukti Pembayaran</button></form>}</Panel></section></SubpageShell>;
}
