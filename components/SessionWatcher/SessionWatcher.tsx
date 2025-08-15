"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// TODO 홈 화면에서도 로그인으로 바로 이동되는 문제 !!! 
export default function SessionWatcher() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log("status  ==> ", status);
        if (status === "unauthenticated") {
            console.log("세션 만료 또는 로그아웃됨 (클라이언트) ");
            router.push("/api/auth/signin"); // 로그인 페이지로 이동
        }
    }, [status, router]);

    return null;
}
