"use client";

import { useEffect, useState } from "react";

export function LanguageSwitch() {
    const [language, setLanguage] = useState("id");
    useEffect(() => { const saved = localStorage.getItem("ppdb:language") ?? "id"; setLanguage(saved); document.documentElement.lang = saved; }, []);
    const changeLanguage = (nextLanguage: string) => { setLanguage(nextLanguage); localStorage.setItem("ppdb:language", nextLanguage); document.documentElement.lang = nextLanguage; };
    return <div className="flex items-center gap-1 border-2 border-primary p-1 text-xs font-bold text-primary" aria-label="Pilih bahasa"><button type="button" onClick={() => changeLanguage("id")} className={`px-2 py-1 ${language === "id" ? "bg-primary text-paper" : ""}`}>ID</button><button type="button" onClick={() => changeLanguage("en")} className={`px-2 py-1 ${language === "en" ? "bg-primary text-paper" : ""}`}>EN</button></div>;
}
