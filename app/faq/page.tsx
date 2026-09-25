import Link from "next/link";
import { Panel, SubpageShell } from "@/app/components/subpage-shell";

const questions = [
    ["Siapa yang bisa mendaftar?", "Lulusan SMP atau sederajat yang ingin mengembangkan keahlian di bidang komputer maupun otomotif."],
    ["Dokumen apa saja yang perlu disiapkan?", "Kartu Keluarga, ijazah atau SKL, akta kelahiran, dan pas foto terbaru dalam format PDF atau gambar."],
    ["Berapa lama proses verifikasi?", "Panitia memeriksa berkas secara bertahap. Status akan diperbarui setelah pemeriksaan selesai."],
    ["Bagaimana cara mengetahui hasil pendaftaran?", "Gunakan nomor pendaftaran pada halaman Cek Status setelah formulir berhasil dikirim."],
];

export default function FAQPage() {
    return <SubpageShell eyebrow="Bantuan PPDB" title="Pertanyaan yang Sering Ditanyakan" intro="Temukan jawaban singkat seputar pendaftaran siswa baru SMK Bani Masum."><section className="mx-auto max-w-3xl px-5 py-14 sm:px-8"><div className="space-y-4">{questions.map(([question, answer]) => <details key={question} className="group border-[3px] border-primary bg-paper p-5 comic-shadow"><summary className="cursor-pointer list-none pr-8 font-bold marker:hidden">{question}<span className="float-right text-primary transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 border-t-2 border-primary/20 pt-4 leading-7 text-neutral-700">{answer}</p></details>)}</div><Panel><div className="sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="font-display text-3xl">Masih perlu bantuan?</h2><p className="mt-2 text-sm leading-6 text-neutral-700">Hubungi panitia untuk pertanyaan yang belum terjawab.</p></div><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="mt-5 inline-flex border-[3px] border-primary bg-primary px-5 py-3 font-bold text-paper comic-shadow sm:mt-0">Chat WhatsApp</a></div></Panel><p className="mt-8 text-center text-sm"><Link href="/ppdb/daftar" className="font-bold text-primary underline underline-offset-4">Mulai pendaftaran</Link></p></section></SubpageShell>;
}
