"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    // const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(decodeURIComponent(searchParams.get("query") || ""));
    // const defaultValue = decodeURIComponent(searchParams.get("query") || "");
    // console.log("Search query:", query);

    useEffect(() => {
        // console.log("Search render");
        setQuery(decodeURIComponent(searchParams.get("query") || ""));
    }, [searchParams.get("query")]);

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
            setIsOpen(false);
            // 글을 보다가 검색을 하면, 검색된 목록만 나와야 함.
            // replace(`${pathname}?${params.toString()}`);
            replace(`/qna/?${params.toString()}`);
        }
    };

    // 추천어 선택 후 키보드 닫히는 시점에 실행됨
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const keyword = e.target.value;
        console.log("검색어 입력 완료:", keyword);
        const params = new URLSearchParams(searchParams);
        // params.set("page", "1"); // 여기
        params.delete("page");
        if (e.currentTarget.value) {
            params.set("query", encodeURIComponent(e.currentTarget.value));
        } else {
            params.delete("query");
        }
        replace(`/qna/?${params.toString()}`);
    }

    return (
        <div className="mr-6">
            {/* PC --------------------------------------------------*/}
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
                    // defaultValue={decodeURIComponent(searchParams.get("query") || "")}
                    // defaultValue={defaultValue}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    aria-label="glass"
                    className="absolute left-3 text-gray-400 peer-focus:text-zinc-200"
                />
            </div>

            {/* mobile --------------------------------------------------*/}
            <div className="sm:hidden flex  items-center relative  ">
                {/* <DropdownMenu> */}
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            aria-label="glass"
                            size="xl"
                            className="absolute left-3 text-gray-400 peer-focus:text-zinc-200 "
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=" bg-gray-700 " align="center">
                        {/* <DropdownMenuItem className="w-full mt-2"> */}
                        <div className="mt-3">
                            <Input
                                type="search"
                                autoFocus
                                inputMode="search"
                                className="rounded-md border-1 border-gray-200 text-sm text-zinc-100 outline-none placeholder:text-zinc-200 "
                                placeholder={placeholder}
                                onKeyDown={handleKeyDown}
                                onBlur={handleBlur}
                                id="searchInput"
                                // defaultValue={decodeURIComponent(searchParams.get("query") || "")}
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                        {/* </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
