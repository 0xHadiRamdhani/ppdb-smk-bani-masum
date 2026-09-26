"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ppdb:theme";

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const nextTheme: Theme = savedTheme === "dark" ? "dark" : "light";
        const updateThemeState = window.setTimeout(() => setTheme(nextTheme), 0);
        applyTheme(nextTheme);
        return () => window.clearTimeout(updateThemeState);
    }, []);

    const toggleTheme = () => {
        const nextTheme: Theme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    };

    return <button type="button" onClick={toggleTheme} className="border-2 border-primary px-2 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-paper" aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"} title={theme === "dark" ? "Mode terang" : "Mode gelap"}>{theme === "dark" ? "Terang" : "Gelap"}</button>;
}