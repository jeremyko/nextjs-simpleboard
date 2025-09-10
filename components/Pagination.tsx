"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useState } from "react";

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
    if (isFromViewPage) {
        //XXX 개별 게시글 페이지에서 페이지네이션을 사용하는 경우에는 /qna 로 이동하게
        // 왜냐하면, /qna/19?page=2 이런식으로 만들어지기 때문.
        // 즉, 게시물 내용을 보여주면서 페이지 이동 안되게 처리함.
        pathname = "/qna";
    }
    // console.log("totalPagesCnt :", totalPagesCnt);
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

    const maxVisibleSerialPages = 5;
   
    // gemini 가 refactoring 함
    const PageLink = ({ page, children }: { page: number; children?: React.ReactNode }) => (
        <Link href={createPageURL(page)}>
            <button
                className={`cursor-pointer px-3 py-1 border rounded ${
                    currentPage === page
                        ? "bg-blue-700 text-white border-blue-700"
                        : "border-gray-300 hover:bg-gray-100"
                }`}
            >
                {children || page}
            </button>
        </Link>
    );

    let pageContent: React.ReactNode[] = [];
    const createRangeArray = (start: number, end: number) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, index) => start + index);
    };

    if (totalPagesCnt < maxVisibleSerialPages) {
        pageContent = Array.from({ length: totalPagesCnt }, (_, index) => (
            <PageLink key={index + 1} page={index + 1} />
        ));
    } else {
        if (currentPage < maxVisibleSerialPages) {
            // 현재 페이지가 1 ~ 시작범위 내 있으면 1~보여줄page 출력
            // 1 2 3 4 5 ... 7354
            pageContent = Array.from({ length: maxVisibleSerialPages }, (_, index) => (
                <PageLink key={index + 1} page={index + 1} />
            ));
            // 뒷쪽 ... 표시
            pageContent.push(<p key="ellipsis-end">...</p>);
            // last page 표시
            pageContent.push(<PageLink key={totalPagesCnt} page={totalPagesCnt} />);
        } else if (currentPage + 3 >= totalPagesCnt) {
            // 현재 page 가 전체 페이지 중 마지막 부근에 위치
            pageContent.push(<PageLink key={1} page={1} />);
            // 앞쪽 ... 표시
            pageContent.push(<p key="ellipsis-start">...</p>);
            //마지막 page 들 전부 표시
            const rangeIndexs = createRangeArray(totalPagesCnt - 4, totalPagesCnt);
            pageContent.push(...rangeIndexs.map((index) => <PageLink key={index} page={index} />));
        } else {
            // 처음, 마지막 그리고 ... 을 보여주고, 현재 page 앞뒤 2page 를 출력
            // ex) 현재 5 page :  1 ... 3 4 5 6 7... 7354
            pageContent.push(<PageLink key={1} page={1} />);
            // 앞쪽 ... 표시
            pageContent.push(<p key="ellipsis-start">...</p>);

            const rangeIndexs = createRangeArray(
                currentPage - 2,
                currentPage + 2 >= totalPagesCnt ? totalPagesCnt : currentPage + 2,
            );
            pageContent.push(...rangeIndexs.map((index) => <PageLink key={index} page={index} />));
            // 뒷쪽 ... 표시
            pageContent.push(<p key="ellipsis-end">...</p>);
            // last page 표시
            pageContent.push(<PageLink key={totalPagesCnt} page={totalPagesCnt} />);
        }
    }

    return (
        <div className="flex flex-wrap justify-center items-center  gap-2 mt-6 mb-9 ">
            <Link href={createPageURL(currentPage - 1)}>
                <button
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    이전
                </button>
            </Link>

            {pageContent}

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
