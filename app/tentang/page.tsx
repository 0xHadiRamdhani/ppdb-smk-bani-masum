import { Panel, SubpageShell } from "@/app/components/subpage-shell";

export default function TentangPage() {
    return <SubpageShell eyebrow="Profil Sekolah" title="Tempat Tumbuhnya Keahlian dan Karakter" intro="SMK Bani Masum hadir untuk menyiapkan generasi muda Subang menjadi tenaga terampil, percaya diri, dan siap melanjutkan perjalanan."><section className="mx-auto grid max-w-5xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-2"><Panel><span className="font-display text-4xl">VISI</span><p className="mt-4 leading-7 text-neutral-700">Menjadi sekolah kejuruan pilihan yang menghasilkan lulusan kompeten, berkarakter, dan relevan dengan dunia kerja.</p></Panel><Panel><span className="font-display text-4xl">MISI</span><p className="mt-4 leading-7 text-neutral-700">Menguatkan praktik, membangun budaya belajar, serta membuka akses pengalaman industri untuk setiap siswa.</p></Panel></section></SubpageShell>;
}
