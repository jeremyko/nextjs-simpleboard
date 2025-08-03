"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
    isFromViewPage = false,
    totalPagesCnt = 0,
}: {
    isFromViewPage?: boolean; // 개별 게시글 페이지에서 페이지네이션을 사용하는 경우
    totalPagesCnt?: number;
}) {
    let pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    if(isFromViewPage) {
        //XXX 개별 게시글 페이지에서 페이지네이션을 사용하는 경우에는 /qna 로 이동하게
        // 왜냐하면, /qna/19?page=2 이런식으로 만들어지기 때문.
        // 즉, 게시물 내용을 보여주면서 페이지 이동 안되게 처리함.
        pathname = "/qna" ;
    }
    console.log("currentPage:", currentPage);
    console.log("isFromViewPage:", isFromViewPage);
    console.log("pathname:", pathname);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        console.log(`${pathname}?${params.toString()}`);
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex justify-center items-center mt-4 space-x-2">
            <Link href={createPageURL(currentPage - 1)}>
                <button
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    이전
                </button>
            </Link>

            {Array.from({ length: totalPagesCnt }, (_, index) => (
                <Link key={index} href={createPageURL(index + 1)}>
                    <button
                        className={`cursor-pointer px-3 py-1 border rounded ${
                            currentPage === index + 1
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {index + 1}
                    </button>
                </Link>
            ))}

            <Link href={createPageURL(currentPage + 1)}>
                <button
                    disabled={currentPage === totalPagesCnt}
                    className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    다음
                </button>
            </Link>
        </div>
    );
}