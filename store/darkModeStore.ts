"use client";

import { create } from "zustand";

interface DarkModeState {
    isDark: boolean;
    toggle: () => void;
    setDark: (value: boolean) => void;
}

export const useDarkModeStore = create<DarkModeState>((set) => ({
    isDark: false,
    toggle: () =>
        set((state) => {
            const newValue = !state.isDark;
            localStorage.setItem("darkMode", JSON.stringify(newValue));
            return { isDark: newValue };
        }),
    setDark: (value: boolean) => set({ isDark: value }),
}));


