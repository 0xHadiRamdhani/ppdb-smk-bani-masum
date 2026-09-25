import Link from "next/link";

const advantages = [
    ["01", "Guru Berpengalaman", "Diajar tenaga pendidik yang paham kebutuhan industri, bukan cuma teori di buku."],
    ["02", "Praktik Langsung", "Jam praktik lebih banyak, plus kesempatan magang di perusahaan mitra."],
    ["03", "Fasilitas Lengkap", "Lab komputer, bengkel, dan ruang praktik yang terus diperbarui."],
    ["04", "Alumni Terserap Kerja", "Jaringan alumni dan mitra industri membantu lulusan mendapat pekerjaan."],
];
const majors = [
    ["RPL", "Teknik Komputer", "Belajar pemrograman, jaringan, dan perangkat lunak untuk kebutuhan industri digital."],
    ["TBSM", "Teknik Otomotif", "Servis dan perawatan sepeda motor, dari mesin hingga sistem kelistrikan."],
];
const steps = [
    ["01", "Isi Formulir", "Lengkapi data diri, data orang tua, dan pilih jurusan."],
    ["02", "Upload Dokumen", "Unggah KK, akta lahir, ijazah/SKL, dan pas foto."],
    ["03", "Verifikasi Berkas", "Panitia memeriksa kelengkapan dokumen kamu."],
    ["04", "Pengumuman", "Cek status kelulusan pakai nomor pendaftaran."],
];
const requirements = ["Fotokopi Kartu Keluarga (KK)", "Fotokopi Akta Kelahiran", "Ijazah / Surat Keterangan Lulus", "Pas foto terbaru 3x4 (2 lembar)", "Fotokopi rapor terakhir", "Nomor HP aktif orang tua/wali"];

function StudentArt() {
    return <div className="relative border-[3px] border-ink bg-paper-soft p-5 comic-shadow-lg">
        <div className="absolute right-4 top-4 h-20 w-20 rounded-full halftone opacity-40" />
        <svg viewBox="0 0 360 340" className="relative w-full" fill="none" aria-label="Ilustrasi siswa SMK" role="img">
            <circle cx="180" cy="150" r="93" stroke="#0A0A0A" strokeWidth="3" />
            <path d="M180 62c-16 0-27 13-27 30 0 12 5 20 9 26-19 8-33 20-33 34h102c0-14-14-26-33-34 4-6 9-14 9-26 0-17-11-30-27-30Z" fill="#F3F2EE" stroke="#0A0A0A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M156 108c2 8 10 13 24 13s22-5 24-13M172 118c3 4 13 4 16 0" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="168" cy="98" r="3.2" fill="#0A0A0A" /><circle cx="192" cy="98" r="3.2" fill="#0A0A0A" />
            <rect x="140" y="150" width="80" height="86" rx="10" fill="#FFF" stroke="#0A0A0A" strokeWidth="3.5" /><path d="M140 168h80" stroke="#0A0A0A" strokeWidth="3" />
            <rect x="118" y="176" width="26" height="40" rx="6" fill="#FFF" stroke="#0A0A0A" strokeWidth="3.5" /><rect x="216" y="176" width="26" height="40" rx="6" fill="#FFF" stroke="#0A0A0A" strokeWidth="3.5" />
            <rect x="164" y="176" width="32" height="24" rx="4" fill="#FFF" stroke="#0A0A0A" strokeWidth="3" /><path d="m160 236-14 46m54-46 14 46M138 90l-14-10m98 10 14-10" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-4 left-4 border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold">SIAP BERKARYA</div>
    </div>;
}

export default function Home() {
    return <main>
        <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
            <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link href="/" className="flex items-center gap-3 no-underline"><span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink font-display text-lg">BM</span><span className="hidden font-display text-xl sm:block">SMK BANI MASUM</span></Link>
                <nav className="hidden items-center gap-6 text-sm font-bold lg:flex"><a href="#keunggulan">Kenapa Kami</a><a href="#jurusan">Jurusan</a><a href="#alur">Alur Daftar</a><a href="#jadwal">Jadwal</a><a href="#syarat">Syarat</a></nav>
                <Link href="/ppdb/daftar" className="comic-button border-[3px] border-ink bg-ink px-4 py-2 text-sm font-bold text-paper shadow-[4px_4px_0_#0A0A0A]">Daftar Sekarang</Link>
            </div>
        </header>

        <section className="border-b-[3px] border-ink py-12 sm:py-16"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
            <div><div className="mb-5 inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-3 py-2 text-xs font-extrabold"><span className="text-base">✦</span>PENDAFTARAN DIBUKA</div><h1 className="font-display text-5xl leading-[.98] sm:text-7xl">Wujudkan Masa Depanmu Mulai dari SMK Bani Masum!</h1><p className="mt-5 max-w-xl text-lg leading-8">Belajar keahlian yang benar-benar dipakai di dunia kerja, dari praktik nyata sampai bimbingan guru yang siap mendampingi kamu sampai lulus.</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/ppdb/daftar" className="comic-button border-[3px] border-ink bg-ink px-6 py-3 font-bold text-paper comic-shadow">Daftar Sekarang</Link><a href="#jurusan" className="comic-button border-[3px] border-ink bg-paper px-6 py-3 font-bold comic-shadow">Lihat Jurusan</a></div></div>
            <StudentArt />
        </div></section>

        <section id="keunggulan" className="border-b-[3px] border-ink py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">Kenapa SMK Bani Masum</p><h2 className="font-display text-4xl sm:text-5xl">Bukan Cuma Sekolah, Tapi Bekal Kerja</h2><p className="mt-3 max-w-2xl leading-7 text-neutral-700">Empat hal yang bikin lulusan kami siap terjun ke dunia kerja maupun lanjut kuliah.</p><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{advantages.map(([number, title, text]) => <article key={title} className="border-[3px] border-ink bg-paper p-5 comic-shadow"><span className="font-display text-4xl">{number}</span><h3 className="mt-4 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-700">{text}</p></article>)}</div></div></section>

        <section id="jurusan" className="border-b-[3px] border-ink bg-paper-soft py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">Kompetensi Keahlian</p><h2 className="font-display text-4xl sm:text-5xl">Pilih Jurusan Sesuai Minatmu</h2><div className="mt-9 grid gap-5 md:grid-cols-2">{majors.map(([code, name, text]) => <article key={code} className="overflow-hidden border-[3px] border-ink bg-paper comic-shadow"><div className="border-b-[3px] border-ink p-6"><span className="font-display text-5xl">{code}</span></div><div className="p-5"><h3 className="font-extrabold">{name}</h3><p className="mt-2 text-sm leading-6 text-neutral-700">{text}</p></div></article>)}</div></div></section>

        <section id="alur" className="border-b-[3px] border-ink py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">Cara Mendaftar</p><h2 className="font-display text-4xl sm:text-5xl">4 Langkah Sampai Resmi Jadi Siswa</h2><div className="mt-9 grid overflow-hidden border-[3px] border-ink sm:grid-cols-2 lg:grid-cols-4 comic-shadow">{steps.map(([number, title, text], index) => <article key={number} className={`bg-paper p-6 ${index < 3 ? "border-b-[3px] lg:border-b-0 lg:border-r-[3px]" : ""} ${index % 2 === 0 ? "sm:border-r-[3px] lg:border-r-[3px]" : ""}`}><span className="font-display text-4xl">{number}</span><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-700">{text}</p></article>)}</div></div></section>

        <section id="jadwal" className="border-b-[3px] border-ink py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">Jadwal PPDB</p><h2 className="font-display text-4xl sm:text-5xl">Jangan Sampai Kelewat Tanggal</h2><div className="mt-9 overflow-x-auto border-[3px] border-ink comic-shadow"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-ink text-paper"><tr><th className="p-4 font-display text-lg">Tahapan</th><th className="p-4 font-display text-lg">Gelombang 1</th><th className="p-4 font-display text-lg">Gelombang 2</th></tr></thead><tbody>{[["Pendaftaran online", "2 Feb – 28 Feb", "3 Mar – 30 Apr"], ["Verifikasi berkas", "1 Mar – 5 Mar", "1 Mei – 5 Mei"], ["Pengumuman", "10 Mar", "10 Mei"], ["Daftar ulang", "11 – 15 Mar", "11 – 15 Mei"]].map((row) => <tr key={row[0]} className="border-b-2 border-ink last:border-0"><td className="p-4">{row[0]}</td><td className="p-4 font-bold">{row[1]}</td><td className="p-4 font-bold">{row[2]}</td></tr>)}</tbody></table></div></div></section>

        <section id="syarat" className="border-b-[3px] border-ink py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">Syarat Pendaftaran</p><h2 className="font-display text-4xl sm:text-5xl">Siapkan Dokumen Ini</h2><div className="mt-8 grid gap-x-10 sm:grid-cols-2">{requirements.map((item) => <div key={item} className="flex items-center gap-3 border-b-2 border-dashed border-ink py-4 text-sm font-semibold"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold">✓</span>{item}</div>)}</div></div></section>

        <section className="py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="border-[3px] border-ink bg-ink px-6 py-12 text-center text-paper comic-shadow-lg sm:px-10"><h2 className="font-display text-4xl sm:text-5xl">Siap Gabung Angkatan Baru?</h2><p className="mx-auto mt-3 max-w-xl text-paper/80">Isi formulir pendaftaran online sekarang, cuma butuh 10 menit.</p><Link href="/ppdb/daftar" className="comic-button mt-7 inline-flex border-[3px] border-ink bg-paper px-6 py-3 font-bold text-ink shadow-[5px_5px_0_#F3F2EE]">Mulai Daftar</Link></div></div></section>

        <footer className="border-t-[3px] border-ink py-10"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-5 sm:px-8"><div><div className="font-display text-2xl">SMK BANI MASUM</div><p className="mt-2 text-sm leading-7 text-neutral-700">Subang, Jawa Barat<br />ppdb@banimasum.sch.id<br />(0260) 000-000</p></div><nav className="flex flex-wrap gap-5 text-sm font-bold"><Link href="/tentang">Tentang</Link><Link href="/jurusan">Jurusan</Link><Link href="/ppdb">PPDB</Link><Link href="/ppdb/cek-status">Cek Status</Link></nav></div><div className="mx-auto mt-8 max-w-7xl px-5 text-xs text-neutral-500 sm:px-8">© 2026 SMK Bani Masum. Semua hak dilindungi.</div></footer>
    </main>;
}
