import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Search from "../Search/Search";
import { Suspense } from "react";
import UserButton from "../UserButton/UserButton";

export default function HeaderNav() {
    return (
        <nav className=" bg-gray-800  text-zinc-300 fixed top-0 w-full z-10 ">
            <div className="max-w-4xl mx-auto text-sm flex justify-between items-center h-14 ">
                <Link href="/" className="text-xl font-bold hover:underline mr-4">
                    <FontAwesomeIcon size="xl" icon={faHouse} aria-label="home" className="text-zinc-200" />
                </Link>

                <div className="flex justify-end items-center gap-4">
                    <Link href="/qna" className="text-sm hover:underline ">
                        Q&A
                    </Link>
                </div>
                <div className="flex justify-end items-center">
                    <Suspense>
                        <Search placeholder="검색어를 입력하세요" />
                    </Suspense>
                    <div className="flex justify-end items-center pl-4">
                        {/* <Link href="/signin" className="pl-8 hover:underline ">
                            로그인
                        </Link> */}
                        <UserButton />
                        {/* <Link href="/signup" className="pl-8 hover:underline  ">
                            회원가입
                        </Link> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
