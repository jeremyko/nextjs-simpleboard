"use server";

// 데이터 요청과 권한 부여 논리를 중앙에서 관리
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const checkIsAuthenticated = async () => {
    const session = await auth();
    // console.log("*** checkIsAuthenticated: session", session);
    if (session) {
        return true;
    }
    redirect("/api/auth/signin");
    // return false;
};

export const checkIsThisMine = async (postUserId:string) => {
    if (!postUserId) {
        return false;
    }
    const session = await auth();
    if (!session) {
        redirect("/api/auth/signin");
        // return false;
    }
    // console.log("*** checkIsThisMine: session", session);
    console.log("*** userId (session) :", session.userId);
    console.log("           (post   ) :", postUserId);
    if(session.userId === postUserId) {
        // console.log("checkIsThisMine: true");
        return true;
    }
    // console.log("checkIsThisMine: false");
    return false;
};

export const isAuthenticatedAndMine = async (postUserId: string) => {
    //TODO : userId 는 db 에서 찾아야 ??? 왜냐하면 이정보를 FE 로 넘겨주면 안될거 같은데???
    // author_id 대신 isAuthor: true/false 만 내려주는 방법도 있음
    // → 이렇게 하면 클라이언트는 작성자 여부만 알고, 실제 ID는 모름
    const session = await auth();
    if (!session) {
        console.error("로그인 안된 상태로 접근함");
        redirect("/api/auth/signin");
        // return false;
    }
    if (!postUserId) {
        return false;
    }
    console.log("*** userId (session) :", session.userId);
    console.log("           (post   ) :", postUserId);
    if(session.userId === postUserId) {
        return true;
    }
    console.error("본인의 게시물이 아님");
    return false;
}



export const getSessionUserId = async () => {
    const session = await auth();
    if (!session) {
        console.log("[createQuestion] 로그인 안된 상태로 접근함");
        return null;
    }
    const userId = session.userId;
    if (!userId) {
        console.log("재 로그인 필요");
        return null;
    }
    console.log("==> getUserId userId:", userId);
    return userId;
};