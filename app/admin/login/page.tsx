"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

export default function AdminLoginPage() {
    const [role, setRole] = useState("admin");
    const login = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); localStorage.setItem("ppdb:role", role); window.location.href = "/admin/dashboard"; };
    return <SubpageShell eyebrow="Area Panitia" title="Login Admin" intro="Pilih akses kerja untuk mengelola proses PPDB."><section className="mx-auto max-w-md px-5 py-14 sm:px-8"><Panel><form onSubmit={login} className="space-y-5"><label className="block text-sm font-bold">Email<input required type="email" className="mt-2 block w-full border-[3px] border-ink px-4 py-3 font-normal" /></label><label className="block text-sm font-bold">Password<input required type="password" className="mt-2 block w-full border-[3px] border-ink px-4 py-3 font-normal" /></label><label className="block text-sm font-bold">Role akses<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal"><option value="admin">Administrator</option><option value="panitia">Panitia verifikasi</option></select></label><button className="w-full border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Masuk</button></form><p className="mt-5 text-xs leading-5 text-neutral-600">Demo frontend: autentikasi produksi perlu dihubungkan ke sistem akun sekolah.</p><Link href="/" className="mt-6 block text-center text-sm font-bold underline">Kembali ke beranda</Link></Panel></section></SubpageShell>;
}
