import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Supabase public URL → storage 내부 경로 변환
export function publicUrlToPath(url: string, bucket: string) {
    // console.debug("publicUrlToPath: url=", url, ", bucket=", bucket);
    const marker = `/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) {
        throw new Error("올바른 Supabase public URL이 아님: " + url);
    }
    return url.substring(idx + marker.length); // 예: "123.png"
}

export function extractImgSrcList(html: string): string[] {
    const regex = /<img[^>]+src\s*=\s*["']([^"']+)["']/gi;
    const result: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
        result.push(match[1]);
    }
    return result;
}
