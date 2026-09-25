import { Panel, SubpageShell } from "@/app/components/subpage-shell";
import { RegistrantTable } from "./registrant-table";

export default function ApplicantsPage() {
    return <SubpageShell eyebrow="Data Pendaftar" title="Verifikasi Pendaftar"><section className="mx-auto max-w-6xl px-5 py-14 sm:px-8"><Panel><RegistrantTable /></Panel></section></SubpageShell>;
}
