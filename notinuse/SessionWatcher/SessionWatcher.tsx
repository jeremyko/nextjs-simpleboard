"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.debug("status  ==> ", status);
        if (status === "unauthenticated") {
            console.debug("SessionWatcher :세션 만료 또는 로그아웃됨 (클라이언트) ");
            // router.push("/api/auth/signin"); // 로그인 페이지로 이동
        }
    }, [status, router]);

    return null;
}
