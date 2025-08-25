"use server";

// client component 에서 사용하게 
import { cookies } from "next/headers";

export async function getviewerIdForCnt() {
    const cookieStore = await cookies();
    const viewerIdForCnt = cookieStore.get("viewerIdForCnt")?.value;
    return viewerIdForCnt;
}
