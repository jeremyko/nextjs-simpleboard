"use client";
// 높이 조절 textarea 를 사용하려면 client에서만 가능하므로 별로도 만듬.

import { BoardItemById } from "@/app/libs/serverDb";
import Button from "@/components/Button/Button";
// import Pagination from "@/components/Pagination/component";
// import BoardDataTable from "@/components/Table/boardList";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

// 서버 컴포넌트에서 이걸 사용하는 방식으로 구현
export default function ViewOneBoardItem({
    oneQnA,
    id,
    page,
    // searchQuery,
    // totalPagesCnt,
}: {
    oneQnA: BoardItemById;
    id: string;
    page: number;
    // searchQuery: string;
    // totalPagesCnt: number;
}) {
    // 글입력시 자동 높이 조정 -----------------
    // const textbox = useRef<HTMLTextAreaElement>(null);
    // function adjustHeight() {
    //     console.log("adjustHeight called");
    //     if (textbox.current) {
    //         textbox.current.style.height = "inherit";
    //         textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    //     }
    // }
    // useLayoutEffect(adjustHeight, []);

    // function handleKeyDown() {
    //     adjustHeight();
    // }
    // 글입력시 자동 높이 조정 -----------------
    return (
        <div className=" max-w-3xl mx-auto ">
            {/* --------------------- */}
            <div className="flex flex-row  ">
                <label className="mt-2 mb-2 block font-light bg-gray-500 text-white pr-2 pl-2 rounded-sm ">
                    {oneQnA.category_name}
                </label>
                <label className="mt-2 ml-4 mb-2 block font-bold">{oneQnA.title}</label>
            </div>
            {/* <div className="pt-2 pb-2 border-b border-gray-600 ">{oneQnA.contents}</div> */}
            <TextareaAutosize
                // ref={textbox}
                // onChange={handleKeyDown}
                id="content"
                name="content"
                rows={10}
                readOnly={true}
                className="mt-2 pt-2 block w-full py-2 "
                defaultValue={oneQnA.contents}
            ></TextareaAutosize>

            {/* --------------------- */}
            <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                <Link href={`/qna/${id}/delete?page=${page}`}>
                    <Button>삭제</Button>
                </Link>
                <Link href={`/qna/${id}/edit?page=${page}`}>
                    <Button>수정</Button>
                </Link>
            </div>
        </div>
    );
}
