"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyboardEvent } from 'react';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    // const pathname = usePathname();
    const { replace } = useRouter();

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
            replace(`/qna/?${params.toString()}`);
        }
    };

    return (
        <div className="mt-2 mb-2 relative flex items-center flex-shrink-0 ">
            <label id="search" htmlFor="searchInput" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border-1 border-gray-200 py-[6px] pl-10 text-sm outline-1 placeholder:text-gray-500"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                id = "searchInput"
                defaultValue={decodeURIComponent(searchParams.get("query") || "")}
            />
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                aria-label="glass"
                className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-zinc-200"
            />
        </div>
    );
}
