"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Pagination({
    isFromViewPage = false,
    totalPagesCnt = 0,
}: {
    isFromViewPage?: boolean; // 개별 게시글 페이지에서 페이지네이션을 사용하는 경우
    totalPagesCnt?: number;
}) {
    let pathname = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = decodeURIComponent(searchParams.get("query") || "");
    const currentPage = Number(searchParams.get("page")) || 1;
    if(isFromViewPage) {
        //XXX 개별 게시글 페이지에서 페이지네이션을 사용하는 경우에는 /qna 로 이동하게
        // 왜냐하면, /qna/19?page=2 이런식으로 만들어지기 때문.
        // 즉, 게시물 내용을 보여주면서 페이지 이동 안되게 처리함.
        pathname = "/qna" ;
    }
    console.log("totalPagesCnt :", totalPagesCnt);
    // console.debug("[Pagination] searchQuery:", searchQuery);
    // console.debug("currentPage:", currentPage);
    // console.debug("isFromViewPage:", isFromViewPage);
    // console.debug("pathname:", pathname);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        params.set("query", encodeURIComponent(searchQuery));
        // console.debug(`${pathname}?${params.toString()}`);
        return `${pathname}?${params.toString()}`;
    };

    const maxVisibleStartingSerialPages= 3;

    function handleGotoPage(e: any) {
        //TODO 
    }
        

    return (
        <div className="flex justify-center items-center  space-x-2 mt-2 mb-9 ">
            <Link href={createPageURL(currentPage - 1)}>
                <button
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    이전
                </button>
            </Link>

            {totalPagesCnt <= maxVisibleStartingSerialPages &&
                Array.from({ length: totalPagesCnt }, (_, index) => (
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

            {/* page 많은 경우, ... 표시 */}
            {totalPagesCnt > maxVisibleStartingSerialPages &&
                Array.from({ length: maxVisibleStartingSerialPages }, (_, index) => (
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
            {totalPagesCnt > maxVisibleStartingSerialPages && (
                <Link key={-1} href={createPageURL(1)}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={"cursor-pointer px-3 py-1 border rounded"}>...</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60 bg-blue-700 " align="center">
                            <DropdownMenuItem className="w-full flex flex-row justify-between items-center gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    autoFocus
                                    inputMode="search"
                                    className="rounded  bg-blue-100 text-bold "
                                    id="gotoPagehInput"
                                />
                                <p className="w-full text-bold text-zinc-200 "> / {totalPagesCnt} </p>
                                <Button
                                    className={
                                        "cursor-pointer px-3 py-1 border rounded font-bold bg-blue-500 text-white hover:bg-blue-600 "
                                    }
                                    onClick={handleGotoPage}
                                >
                                    이동
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Link>
            )}
            {/* 마지막 page  */}
            {totalPagesCnt > maxVisibleStartingSerialPages && (
                <Link key={totalPagesCnt} href={createPageURL(totalPagesCnt)}>
                    <button
                        className={`cursor-pointer px-3 py-1 border rounded ${
                            currentPage === totalPagesCnt
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {totalPagesCnt}
                    </button>
                </Link>
            )}
            <Link href={createPageURL(currentPage + 1)}>
                <button
                    disabled={totalPagesCnt == 0 || currentPage === totalPagesCnt}
                    className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    다음
                </button>
            </Link>
        </div>
    );
}