'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
// import React, { useState } from "react";

export default function Pagination({ totalPagesCnt = 0 }: { totalPagesCnt?: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    // const allPages = generatePagination(currentPage, totalPages);

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