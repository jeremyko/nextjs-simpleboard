'use client';

import React, { useState } from "react";

export default function Pagination({ totalPagesCnt = 0 }: { totalPagesCnt?: number }) {
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPagesCnt) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="flex justify-center items-center mt-4 space-x-2">
            {/* 이전 버튼 */}
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
                이전
            </button>

            {/* 숫자 페이지 */}
            {Array.from({ length: totalPagesCnt }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={`px-3 py-1 border rounded ${
                        currentPage === index + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    {index + 1}
                </button>
            ))}

            {/* 다음 버튼 */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPagesCnt}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
                다음
            </button>
        </div>
    );
}