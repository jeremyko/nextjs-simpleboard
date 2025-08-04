"use client";

import { fetchPagedBoardItems } from "../app/libs/serverDb";
import React, { useState } from "react";

// 샘플 데이터 (10개)
const allPosts = [
    {
        id: 10,
        category: "공지",
        title: "사이트 점검 안내",
        comments: 2,
        date: "2025-07-21",
        views: 120,
    },
    {
        id: 9,
        category: "자유",
        title: "오늘 점심 뭐 먹을까요?",
        comments: 5,
        date: "2025-07-20",
        views: 80,
    },
    {
        id: 8,
        category: "Q&A",
        title: "React 상태 관리 질문",
        comments: 1,
        date: "2025-07-19",
        views: 64,
    },
    {
        id: 7,
        category: "공지",
        title: "서비스 업데이트 소식",
        comments: 0,
        date: "2025-07-18",
        views: 200,
    },
    {
        id: 6,
        category: "자유",
        title: "개발자 밋업 후기",
        comments: 3,
        date: "2025-07-17",
        views: 95,
    },
    {
        id: 5,
        category: "공지",
        title: "AI 서비스 오픈 소식",
        comments: 4,
        date: "2025-07-16",
        views: 180,
    },
    {
        id: 4,
        category: "자유",
        title: "요즘 개발 트렌드",
        comments: 2,
        date: "2025-07-15",
        views: 140,
    },
    {
        id: 3,
        category: "Q&A",
        title: "Tailwind CSS 사용법",
        comments: 6,
        date: "2025-07-14",
        views: 75,
    },
    {
        id: 2,
        category: "공지",
        title: "서버 이전 공지",
        comments: 0,
        date: "2025-07-13",
        views: 250,
    },
    {
        id: 1,
        category: "자유",
        title: "프리랜서 팁 공유",
        comments: 8,
        date: "2025-07-12",
        views: 300,
    },
    {
        id: 20,
        category: "공지",
        title: "사이트 점검 안내",
        comments: 2,
        date: "2025-07-21",
        views: 120,
    },
    {
        id: 9,
        category: "자유",
        title: "오늘 점심 뭐 먹을까요?",
        comments: 5,
        date: "2025-07-20",
        views: 80,
    },
    {
        id: 8,
        category: "Q&A",
        title: "React 상태 관리 질문",
        comments: 1,
        date: "2025-07-19",
        views: 64,
    },
    {
        id: 7,
        category: "공지",
        title: "서비스 업데이트 소식",
        comments: 0,
        date: "2025-07-18",
        views: 200,
    },
    {
        id: 6,
        category: "자유",
        title: "개발자 밋업 후기",
        comments: 3,
        date: "2025-07-17",
        views: 95,
    },
    {
        id: 5,
        category: "공지",
        title: "AI 서비스 오픈 소식",
        comments: 4,
        date: "2025-07-16",
        views: 180,
    },
    {
        id: 4,
        category: "자유",
        title: "요즘 개발 트렌드",
        comments: 2,
        date: "2025-07-15",
        views: 140,
    },
    {
        id: 3,
        category: "Q&A",
        title: "Tailwind CSS 사용법",
        comments: 6,
        date: "2025-07-14",
        views: 75,
    },
    {
        id: 2,
        category: "공지",
        title: "서버 이전 공지",
        comments: 0,
        date: "2025-07-13",
        views: 250,
    },
    {
        id: 1,
        category: "자유",
        title: "프리랜서 팁 공유",
        comments: 8,
        date: "2025-07-12",
        views: 300,
    },
    {
        id: 30,
        category: "공지",
        title: "사이트 점검 안내",
        comments: 2,
        date: "2025-07-21",
        views: 120,
    },
    {
        id: 9,
        category: "자유",
        title: "오늘 점심 뭐 먹을까요?",
        comments: 5,
        date: "2025-07-20",
        views: 80,
    },
    {
        id: 8,
        category: "Q&A",
        title: "React 상태 관리 질문",
        comments: 1,
        date: "2025-07-19",
        views: 64,
    },
    {
        id: 7,
        category: "공지",
        title: "서비스 업데이트 소식",
        comments: 0,
        date: "2025-07-18",
        views: 200,
    },
    {
        id: 6,
        category: "자유",
        title: "개발자 밋업 후기",
        comments: 3,
        date: "2025-07-17",
        views: 95,
    },
    {
        id: 5,
        category: "공지",
        title: "AI 서비스 오픈 소식",
        comments: 4,
        date: "2025-07-16",
        views: 180,
    },
    {
        id: 4,
        category: "자유",
        title: "요즘 개발 트렌드",
        comments: 2,
        date: "2025-07-15",
        views: 140,
    },
    {
        id: 3,
        category: "Q&A",
        title: "Tailwind CSS 사용법",
        comments: 6,
        date: "2025-07-14",
        views: 75,
    },
    {
        id: 2,
        category: "공지",
        title: "서버 이전 공지",
        comments: 0,
        date: "2025-07-13",
        views: 250,
    },
    {
        id: 1,
        category: "자유",
        title: "프리랜서 팁 공유",
        comments: 8,
        date: "2025-07-12",
        views: 300,
    },
];

const POSTS_PER_PAGE = 10;

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="min-h-screen max-w-3xl mx-auto font-sans">
            <div className="text-2xl font-bold p-4 mb-4 text-left">
                <h1> Q&A </h1>
            </div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-green-700">
                        <th className="p-3 text-center">번호</th>
                        <th className="p-3 text-center">분류</th>
                        <th className="p-3 text-center">제목</th>
                        <th className="p-3 text-center">날짜</th>
                        <th className="p-3 text-center">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((post) => (
                        <tr key={post.id} className="border-b border-green-700 ">
                            <td className="p-3 text-center">{post.id}</td>
                            <td className="p-3 text-center">{post.category}</td>
                            <td className="p-3 text-left">
                                {post.comments > 0 && (
                                    <span className="bg-gray-500 text-white pr-2 pl-2 rounded-sm font-light mr-2">
                                        {post.comments}
                                    </span>
                                )}
                                <a href={`/post/${post.id}`} className="text-gray-800 hover:underline">
                                    {post.title}
                                </a>
                            </td>
                            <td className="p-3 text-center">{post.date}</td>
                            <td className="p-3 text-center">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-right  mt-8 mb-8">총 {allPosts.length}개의 게시글</div>

            {/* 페이징 */}
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
                {Array.from({ length: totalPages }, (_, index) => (
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
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    다음
                </button>
            </div>
        </div>
    );
}
