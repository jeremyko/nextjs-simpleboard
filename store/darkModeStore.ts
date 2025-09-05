"use client";

import { create } from "zustand";

interface DarkModeState {
    dark: boolean;
    toggle: () => void;
    setDark: (value: boolean) => void;
}

export const useDarkModeStore = create<DarkModeState>((set) => ({
    dark: false,
    toggle: () =>
        set((state) => {
            const newValue = !state.dark;
            localStorage.setItem("darkMode", JSON.stringify(newValue));
            return { dark: newValue };
        }),
    setDark: (value: boolean) => set({ dark: value }),
}));


