"use server";

// 데이터 요청과 권한 부여 논리를 중앙에서 관리
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const checkIsAuthenticated = async () => {
    const session = await auth();
    // console.debug("*** checkIsAuthenticated: session", session);
    if (session) {
        return true;
    }
    // redirect("/api/auth/signin");
    return false;
};

export const checkIsThisMine = async (postUserId: string) => {
    if (!postUserId) {
        return false;
    }
    const session = await auth();
    if (!session) {
        redirect("/api/auth/signin");
        // return false;
    }
    // console.debug("*** checkIsThisMine: session", session);
    // console.debug("*** userId (session) :", session.userId);
    // console.debug("           (post   ) :", postUserId);
    if (session.userId === postUserId) {
        // console.debug("checkIsThisMine: true");
        return true;
    }
    // console.debug("checkIsThisMine: false");
    return false;
};

export const isAuthenticatedAndMine = async (postUserId: string, needRedirectToLogin = false) => {
    const session = await auth();
    if (!session) {
        if (needRedirectToLogin) {
            console.error("로그인 안된 상태로 접근함");
            redirect("/api/auth/signin");
        }
        return false;
    }
    if (!postUserId) {
        return false;
    }
    // console.debug("*** userId (session) :", session.userId);
    // console.debug("           (post   ) :", postUserId);
    if (session.userId === postUserId) {
        return true;
    }
    // console.debug("본인의 게시물이 아님");
    return false;
};



export const getSessionUserId = async () => {
    const session = await auth();
    if (!session) {
        // console.debug("[getSessionUserId] 로그인 안된 상태로 접근함");
        return null;
    }
    const userId = session.userId;
    if (!userId) {
        console.debug("재 로그인 필요");
        return null;
    }
    // console.debug("==> getUserId userId:", userId);
    return userId;
};