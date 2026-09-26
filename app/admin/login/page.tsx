"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
            });
            const result = await response.json() as { error?: string };
            if (!response.ok) throw new Error(result.error || "Login gagal.");
            router.replace("/admin");
            router.refresh();
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Login gagal. Coba lagi.");
            setLoading(false);
        }
    };

    return <SubpageShell eyebrow="Area Panitia" title="Login Admin" intro="Masuk menggunakan akun admin sekolah."><section className="mx-auto max-w-md px-5 py-14 sm:px-8"><Panel><form onSubmit={login} className="space-y-5"><label className="block text-sm font-bold">Username<input required name="username" autoComplete="username" className="mt-2 block w-full border-[3px] border-ink px-4 py-3 font-normal" /></label><label className="block text-sm font-bold">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 block w-full border-[3px] border-ink px-4 py-3 font-normal" /></label>{error && <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-bold text-red-800">{error}</p>}<button disabled={loading} className="w-full border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow disabled:opacity-60">{loading ? "Memeriksa..." : "Masuk"}</button></form><Link href="/" className="mt-6 block text-center text-sm font-bold underline">Kembali ke beranda</Link></Panel></section></SubpageShell>;
}
