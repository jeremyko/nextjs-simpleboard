"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyboardEvent, useState } from 'react';
import { Input } from "@/components/ui/input";

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    // const pathname = usePathname();
    const { replace } = useRouter();
    const [showMobileSearch, setShowMobileSearch] = useState(false); // mobile 인 경우에 검색창

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // console.debug(`Searching [${event.currentTarget.value}]`);
            const params = new URLSearchParams(searchParams);
            // params.set("page", "1"); // 여기
            params.delete("page");
            if (event.currentTarget.value) {
                params.set("query", encodeURIComponent(event.currentTarget.value));
            } else {
                params.delete("query");
            }
            // 글을 보다가 검색을 하면, 검색된 목록만 나와야 함.
            // replace(`${pathname}?${params.toString()}`);
            setShowMobileSearch(false);
            replace(`/qna/?${params.toString()}`);
        }
    };

    //TODO : 모바일인 경우에는 돋보기 그림을 버튼으로 사용하게, pc 는 input + 그림
    return (
        <div className="mr-6">
            {/* PC */}
            <div className="hidden sm:flex relative items-center flex-shrink-0 ">
                <label id="search" htmlFor="searchInput" className="sr-only">
                    Search
                </label>
                <Input
                    type="search"
                    className=" w-full rounded-md border-1 border-gray-200 py-[2px] pl-10 text-sm outline-1 placeholder:text-gray-500 hidden sm:flex"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    id="searchInput"
                    defaultValue={decodeURIComponent(searchParams.get("query") || "")}
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    aria-label="glass"
                    className="absolute left-3 text-gray-400 peer-focus:text-zinc-200"
                />
            </div>

            {/* mobile */}
            <div className="sm:hidden flex  items-center relative ">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    aria-label="glass"
                    size="xl"
                    className="absolute left-3 text-gray-400 peer-focus:text-zinc-200 "
                    onClick={() => {
                        setShowMobileSearch(!showMobileSearch);
                    }}
                />
            </div>
            {showMobileSearch && (
                <div className="absolute left-0  top-full  w-full bg-gray-700 sm:hidden">
                    {/* TODO : auto focus */}
                    <Input
                        type="search"
                        // inputMode="search"
                        className=" w-full rounded-md border-1 border-gray-200 py-[6px] p-2 text-sm outline-1 placeholder:text-gray-400 "
                        placeholder={placeholder}
                        onKeyDown={handleKeyDown}
                        id="searchInput"
                        defaultValue={decodeURIComponent(searchParams.get("query") || "")}
                    />
                </div>
            )}
        </div>
    );
}
