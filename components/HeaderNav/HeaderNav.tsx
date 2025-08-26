'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Search from "../Search/Search";
import { Suspense } from "react";
import UserButton from "../UserButton/UserButton";
import { useState } from "react"

export default function HeaderNav() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full bg-gray-800 text-white sticky top-0 z-100">
            <div className=" max-w-3xl mx-auto text-sm flex justify-between items-center p-2 relative ">
                <div className="flex justify-between items-center gap-4">
                    {/* 모바일 메뉴 버튼 */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden mr-2 p-2 border rounded"
                    >
                        ☰
                    </button>
                    <Link href="/" className="ml-2 " aria-label="home">
                        <FontAwesomeIcon
                            size="2xl"
                            icon={faHouse}
                            aria-label="home"
                            className="text-zinc-200"
                        />
                    </Link>
                </div>
                <Link href="/qna" className="text-base hover:underline pt-4 mr-12 p-2">
                    Q&A
                </Link>
                <Search placeholder="검색어를 입력하세요" />
                <div className=" p-2">
                    <UserButton />
                </div>

                {/* PC 인 경우 640px 이상*/}
                <nav className="hidden sm:flex gap-4"></nav>

                {/* 모바일인 경우 */}
                {/* <nav className="sm:flex gap-6">
                <div className="flex justify-end items-center">
                    <Search placeholder="검색어를 입력하세요" />
                </div>
            </nav> */}

                {/* 모바일 드롭다운 메뉴 */}
                {menuOpen && (
                    <div className="absolute left-0 top-full bg-gray-700 flex flex-col items-start p-4 sm:hidden">
                        <div className="flex justify-between items-center mt-2 gap-4">
                            <p>test1</p>
                            <p>test2</p>
                        </div>
                    </div>
                )}
            </div>
        </header>

        // <nav className=" bg-gray-800  text-zinc-300   w-full z-10 sticky top-0  ">
        //     <div className=" max-w-3xl mx-auto text-sm flex justify-between items-center  p-2">
        //         <Link href="/" className="text-xl font-bold mr-4" aria-label="home">
        //             <FontAwesomeIcon size="xl" icon={faHouse} aria-label="home" className="text-zinc-200" />
        //         </Link>

        //         <div className="flex justify-end items-center gap-4">
        //             <Link href="/qna" className="text-sm hover:underline ">
        //                 Q&A
        //             </Link>
        //         </div>
        //         <div className="flex justify-end items-center">
        //             <Search placeholder="검색어를 입력하세요" />
        //             <div className="flex justify-end items-center pl-4">
        //                 <UserButton />
        //             </div>
        //         </div>
        //         {/* 모바일 메뉴 버튼 */}
        //         <button className="sm:hidden p-2 border rounded">☰</button>
        //     </div>
        // </nav>
    );
}
