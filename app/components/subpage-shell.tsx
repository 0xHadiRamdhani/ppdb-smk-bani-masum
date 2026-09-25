import Link from "next/link";

export function SubpageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
    return <main><header className="border-b-[3px] border-ink bg-paper"><div className="mx-auto flex h-[74px] max-w-5xl items-center justify-between px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink font-display text-lg">BM</span><span className="font-display text-xl">SMK BANI MASUM</span></Link><Link href="/" className="text-sm font-bold underline underline-offset-4">← Beranda</Link></div></header><section className="border-b-[3px] border-ink bg-paper-soft py-14"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide">{eyebrow}</p><h1 className="font-display text-5xl sm:text-6xl">{title}</h1>{intro && <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">{intro}</p>}</div></section>{children}</main>;
}

export function Panel({ children }: { children: React.ReactNode }) {
    return <div className="border-[3px] border-ink bg-paper p-6 comic-shadow sm:p-8">{children}</div>;
}
