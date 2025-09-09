"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon,} from "@fortawesome/free-solid-svg-icons";
import { useDarkModeStore } from "@/store/darkModeStore";

interface ThemeToggleProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", size = "md" }) => {
    const [mounted, setMounted] = useState(false);
    const { isDark, toggle } = useDarkModeStore();

    // 컴포넌트가 마운트된 후에 테마 상태를 확인
    useEffect(() => {
        setMounted(true);
    }, []);

    // 사이즈별 클래스 설정
    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-8 h-8 text-base",
        lg: "w-10 h-10 text-lg",
    };

    // 하이드레이션 에러 방지
    if (!mounted) {
        return (
            <div
                className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse ${className}`}
            />
        );
    }

    return (
        <button
            onClick={toggle}
            className={`
            ${sizeClasses[size]}
            ${className}
            relative
            rounded-full
            bg-gray-100 dark:bg-gray-600
            hover:bg-gray-300 dark:hover:bg-gray-700
            transition-all duration-300 ease-in-out
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
            shadow-md hover:shadow-lg
            group
        `}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
            <i
                className={`
                text-orange-400
                transition-all duration-300 ease-in-out
                ${isDark ? "opacity-0 scale-75 rotate-180" : "opacity-100 scale-100 rotate-0"}
                absolute
            `}
            >
                <FontAwesomeIcon icon={faSun} />
            </i>

            <i
                className={`
                text-blue-400
                transition-all duration-300 ease-in-out
                ${isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-180"}
                absolute
            `}
            >
                <FontAwesomeIcon icon={faMoon} />
            </i>
        </button>
    );
};

export default ThemeToggle;
