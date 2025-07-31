import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function HeaderNav() {
    return (
        <header>
            <nav className=" bg-gray-800  text-zinc-300 p-4 h-[100px]">
                <div className="max-w-4xl mx-auto text-sm flex justify-end items-end">
                    <a href="/signin" className="pl-6 hover:underline ">
                        로그인
                    </a>
                    <a href="/signup" className="pl-6 hover:underline ml-4 ">
                        회원가입
                    </a>
                </div>

                <div className="max-w-4xl mx-auto text-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-xl font-bold hover:underline mr-4">
                            <FontAwesomeIcon size="xl" icon={faHouse} className="text-zinc-200" />
                        </a>
                    </div>

                    <div>
                        <ul className="flex space-x-4 align-bottom pt-4">
                            <li className="pl-6">
                                {/* <a href="/dashboard" className="hover:underline ">Q&A</a> */}
                                <Link href="/dashboard" className="hover:underline ">
                                    Q&A
                                </Link>
                            </li>
                            <li className="pl-6">
                                <Link href="/dashboard" className="hover:underline ">
                                    Q&A
                                </Link>
                            </li>
                            <li className="pl-6">
                                <Link href="/dashboard" className="hover:underline ">
                                    Q&A
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
