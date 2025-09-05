"use client";

import { useEffect } from "react";
import { useDarkModeStore } from "@/store/darkModeStore";

export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const { dark, setDark } = useDarkModeStore();

    // 페이지 로드 시 localStorage에서 모드 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) setDark(JSON.parse(saved));
    }, [setDark]);

    // dark 클래스 적용
    useEffect(() => {
        const html = document.documentElement;
        if (dark) html.classList.add("dark");
        else html.classList.remove("dark");
    }, [dark]);

    return <>{children}</>;
}
