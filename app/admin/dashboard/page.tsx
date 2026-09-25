"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { defaultSchedule } from "@/app/lib/ppdb-data";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

type Schedule = string[][];

type SavedRegistration = { status?: string };

export default function DashboardPage() {
    const [role, setRole] = useState("admin");
    const [schedule, setSchedule] = useState<Schedule>(defaultSchedule.map((row) => [...row]));
    const [stats, setStats] = useState([["0", "Pendaftar tersimpan"], ["0", "Menunggu verifikasi"], ["0", "Sudah diterima"]]);

    useEffect(() => {
        setRole(localStorage.getItem("ppdb:role") ?? "admin");
        const savedSchedule = localStorage.getItem("ppdb:schedule");
        if (savedSchedule) setSchedule(JSON.parse(savedSchedule) as Schedule);
        const registrations = Object.keys(localStorage).filter((key) => key.startsWith("ppdb:BM26-"));
        const values = registrations.map((key) => JSON.parse(localStorage.getItem(key) ?? "{}") as SavedRegistration);
        setStats([[String(values.length), "Pendaftar tersimpan"], [String(values.filter((item) => item.status === "Menunggu verifikasi").length), "Menunggu verifikasi"], [String(values.filter((item) => item.status === "Diterima").length), "Sudah diterima"]]);
    }, []);

    const updateSchedule = (rowIndex: number, columnIndex: number, event: ChangeEvent<HTMLInputElement>) => setSchedule((current) => current.map((row, index) => index === rowIndex ? row.map((value, column) => column === columnIndex ? event.target.value : value) : row));
    const saveSchedule = () => localStorage.setItem("ppdb:schedule", JSON.stringify(schedule));

    return <SubpageShell eyebrow="Dashboard Admin" title="Ringkasan PPDB" intro={`Mode akses: ${role === "admin" ? "Administrator" : "Panitia verifikasi"}. Pantau penerimaan siswa baru tahun ajaran 2026/2027.`}><section className="mx-auto max-w-6xl space-y-6 px-5 py-14 sm:px-8"><div className="grid gap-5 sm:grid-cols-3">{stats.map(([number, label]) => <Panel key={label}><span className="font-display text-5xl text-primary">{number}</span><p className="mt-2 text-sm font-bold">{label}</p></Panel>)}</div><Panel><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-3xl">Kelola Pendaftar</h2><p className="mt-1 text-sm text-neutral-700">Filter, periksa dokumen, dan perbarui status.</p></div><Link href="/admin/pendaftar" className="border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Buka Tabel</Link></div></Panel>{role === "admin" && <Panel><h2 className="font-display text-3xl">Jadwal PPDB Dinamis</h2><p className="mt-1 text-sm text-neutral-700">Perubahan tersimpan di browser ini dan langsung tampil di halaman PPDB.</p><div className="mt-5 space-y-3">{schedule.map((row, rowIndex) => <div key={row[0]} className="grid gap-2 md:grid-cols-3">{row.map((value, columnIndex) => <input key={`${rowIndex}-${columnIndex}`} value={value} onChange={(event) => updateSchedule(rowIndex, columnIndex, event)} className="border-[3px] border-ink bg-paper px-3 py-2 text-sm" aria-label={`Jadwal baris ${rowIndex + 1} kolom ${columnIndex + 1}`} />)}</div>)}</div><button type="button" onClick={saveSchedule} className="mt-5 border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Simpan Jadwal</button></Panel>}</section></SubpageShell>;
}
