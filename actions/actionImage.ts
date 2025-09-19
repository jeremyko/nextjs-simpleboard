// app/actions/uploadImage.ts
"use server";

import { supabaseServer } from "@/app/libs/supabaseServer";
import { getImgBucketName } from "@/global_const/global_const";
import { randomUUID } from "crypto";

export async function uploadImageAction(file: File) {
    if (!file) throw new Error("No file provided");

    const ext = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;

    // Supabase 버킷에 업로드
    const { error } = await supabaseServer.storage
        .from(getImgBucketName())
        .upload(fileName, file, { upsert: false });

    if (error) {
        console.error("Error uploading image:", error);
        throw error;
    }

    // 퍼블릭 URL 가져오기
    const {
        data: { publicUrl },
    } = supabaseServer.storage.from(getImgBucketName()).getPublicUrl(fileName);

    return publicUrl;
}

export async function deleteImageAction(paths: string[]) {
    const { error } = await supabaseServer.storage.from(getImgBucketName()).remove(paths);

    if (error) {
        console.error("Error remove images:", error);
        throw error;
    }
}