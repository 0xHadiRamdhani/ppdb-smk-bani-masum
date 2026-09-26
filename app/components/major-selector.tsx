"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { majors } from "@/app/lib/ppdb-data";
import { StaggerGroup, StaggerItem } from "./motion";

export default function MajorSelector() {
    const [selectedMajor, setSelectedMajor] = useState<typeof majors[number] | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (selectedMajor && !dialog.open) dialog.showModal();
        if (!selectedMajor && dialog.open) dialog.close();
    }, [selectedMajor]);

    return <>
        <StaggerGroup className="mt-9 grid gap-5 md:auto-rows-fr md:grid-cols-2">
            {majors.map((major) => <StaggerItem key={major.code} className="h-full md:h-[300px]">
                <button type="button" onClick={() => setSelectedMajor(major)} className="group flex h-full w-full flex-col overflow-hidden border-[3px] border-primary bg-paper text-left comic-shadow transition-transform hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    <span className="block w-full border-b-[3px] border-primary bg-primary-soft p-6"><span className="font-display text-5xl text-primary">{major.code}</span></span>
                    <span className="flex flex-1 flex-col p-5">
                        <span className="font-extrabold">{major.name}</span>
                        <span className="mt-2 text-sm leading-6 text-neutral-700">{major.description}</span>
                        <span className="mt-auto pt-4 text-sm font-bold text-primary">Lihat detail jurusan <span aria-hidden="true">→</span></span>
                    </span>
                </button>
            </StaggerItem>)}
        </StaggerGroup>

        <dialog
            ref={dialogRef}
            onCancel={() => setSelectedMajor(null)}
            onClick={(event) => {
                if (event.target === dialogRef.current) setSelectedMajor(null);
            }}
            className="m-auto max-h-[min(90dvh,780px)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto border-[3px] border-primary bg-paper p-0 text-ink backdrop:bg-ink/70"
            aria-labelledby="major-dialog-title"
        >
            {selectedMajor && <>
                <div className="flex items-start justify-between gap-4 border-b-[3px] border-primary bg-primary-soft p-5 sm:p-7">
                    <div>
                        <p className="font-display text-4xl text-primary">{selectedMajor.code}</p>
                        <h2 id="major-dialog-title" className="mt-1 text-xl font-extrabold sm:text-2xl">{selectedMajor.name}</h2>
                    </div>
                    <button type="button" onClick={() => setSelectedMajor(null)} aria-label="Tutup detail jurusan" className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary text-2xl font-bold text-primary hover:bg-paper focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary">×</button>
                </div>
                <div className="space-y-6 p-5 sm:p-7">
                    <p className="leading-7 text-neutral-700">{selectedMajor.description}</p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <section>
                            <h3 className="font-extrabold text-primary">Prospek kerja</h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-700">{selectedMajor.careers.map((career) => <li key={career}>{career}</li>)}</ul>
                        </section>
                        <section>
                            <h3 className="font-extrabold text-primary">Fasilitas praktik</h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-700">{selectedMajor.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                        </section>
                    </div>
                    <Link href="/ppdb/daftar" className="inline-flex border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow">Daftar Sekarang</Link>
                </div>
            </>}
        </dialog>
    </>;
}