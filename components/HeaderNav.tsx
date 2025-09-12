"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Search from "@/components/Search";

import { Suspense } from "react";
// useSearchParams() should be wrapped in a suspense boundary at page "/404".
// Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout

import UserButton from "@/components/UserButton";

export default function HeaderNav() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 모바일 메뉴 버튼
    // const mobileMenu = (
    //     <button
    //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    //         className="sm:hidden mr-2 p-2 border rounded"
    //     >
    //         <FontAwesomeIcon icon={faBars} />
    //     </button>
    // );

    // home icon
    const homeIcon = (
        <Link href="/" className="ml-2 " aria-label="home">
            <FontAwesomeIcon size="2xl" icon={faHouse} aria-label="home" className="text-zinc-200" />
        </Link>
    );

    // 모바일 드롭다운 메뉴
    // const mobileDropDownMenu = (
    //     <div className="absolute left-0 top-full bg-gray-700 flex flex-col items-start p-4 sm:hidden">
    //         <div className="flex justify-between items-center mt-2 gap-4">
    //             <p>test1</p>
    //             <p>test2</p>
    //         </div>
    //     </div>
    // );

    return (
        <header className="w-full bg-gray-800 text-white sticky top-0 z-100">
            <div className=" max-w-3xl mx-auto text-sm flex justify-between items-center p-2 relative ">
                <div className="flex justify-between items-center gap-4">
                    {/* {mobileMenu} */}
                    {homeIcon}
                </div>
                <Link href="/qna" className="text-base hover:underline mr-12 p-2">
                    Q&A
                </Link>
                <Suspense>
                    <Search placeholder="검색어를 입력하세요" />
                </Suspense>
                <div className=" ">
                    <UserButton />
                </div>
                {/* {mobileMenuOpen && mobileDropDownMenu} */}
            </div>
        </header>
    );
}
