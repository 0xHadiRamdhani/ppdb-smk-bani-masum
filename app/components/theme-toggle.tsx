"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

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

    return <button type="button" onClick={toggleTheme} className="theme-toggle flex h-9 w-9 items-center justify-center border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-paper" aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"} title={theme === "dark" ? "Mode terang" : "Mode gelap"}>{theme === "dark" ? <Sun aria-hidden="true" size={20} strokeWidth={3} /> : <Moon aria-hidden="true" size={20} strokeWidth={3} />}</button>;
}