"use client";

import { useEffect, useState } from "react";

type Applicant = {
    number: string;
    name: string;
    major: string;
    status: string;
};

const initialApplicants: Applicant[] = [
    { number: "BM26-102938", name: "Aulia Rahman", major: "RPL", status: "Menunggu verifikasi" },
    { number: "BM26-293847", name: "Dimas Pratama", major: "TBSM", status: "Diterima" },
    { number: "BM26-384756", name: "Nadia Putri", major: "RPL", status: "Revisi berkas" },
];

const filters = ["Semua", "RPL", "TBSM", "Menunggu verifikasi", "Diterima", "Revisi berkas"];
const statuses = ["Menunggu verifikasi", "Diterima", "Revisi berkas"];

function readSavedApplicants() {
    if (typeof window === "undefined") return initialApplicants;
    const saved = Object.keys(localStorage)
        .filter((key) => key.startsWith("ppdb:BM26-"))
        .map((key) => JSON.parse(localStorage.getItem(key) ?? "{}") as Partial<Applicant>)
        .filter((applicant) => applicant.number && applicant.name)
        .map((applicant) => ({
            number: applicant.number ?? "",
            name: applicant.name ?? "",
            major: applicant.major?.split(" ")[0] ?? "-",
            status: applicant.status ?? "Menunggu verifikasi",
        }));
    return [...initialApplicants, ...saved.filter((item) => !initialApplicants.some((initial) => initial.number === item.number))];
}

function escapeCsv(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
}

export function RegistrantTable() {
    const [filter, setFilter] = useState("Semua");
    const [rows, setRows] = useState<Applicant[]>(initialApplicants);

    useEffect(() => setRows(readSavedApplicants()), []);

    const filteredRows = rows.filter((row) => filter === "Semua" || row.major === filter || row.status === filter);
    const updateStatus = (number: string, status: string) => {
        setRows((current) => current.map((row) => row.number === number ? { ...row, status } : row));
        const saved = localStorage.getItem(`ppdb:${number}`);
        if (saved) localStorage.setItem(`ppdb:${number}`, JSON.stringify({ ...JSON.parse(saved), status }));
    };
    const exportCsv = () => {
        const csv = ["Nomor,Nama,Jurusan,Status", ...rows.map((row) => [row.number, row.name, row.major, row.status].map(escapeCsv).join(","))].join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "pendaftar-ppdb.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return <>
        <div className="flex flex-wrap justify-between gap-3">
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="border-[3px] border-ink bg-paper px-3 py-2 text-sm font-bold" aria-label="Filter pendaftar">
                {filters.map((option) => <option key={option}>{option}</option>)}
            </select>
            <button type="button" onClick={exportCsv} className="border-[3px] border-primary bg-primary px-4 py-2 text-sm font-bold text-paper comic-shadow">Export CSV</button>
        </div>
        <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-primary text-paper"><tr><th className="p-3">Nomor</th><th className="p-3">Nama</th><th className="p-3">Jurusan</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr></thead>
                <tbody>{filteredRows.map((row) => <tr key={row.number} className="border-b-2 border-primary/20"><td className="p-3 font-bold">{row.number}</td><td className="p-3">{row.name}</td><td className="p-3">{row.major}</td><td className="p-3">{row.status}</td><td className="p-3"><select value={row.status} onChange={(event) => updateStatus(row.number, event.target.value)} className="border-2 border-primary bg-paper px-2 py-1 text-xs font-bold" aria-label={`Status ${row.number}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody>
            </table>
        </div>
    </>;
}
