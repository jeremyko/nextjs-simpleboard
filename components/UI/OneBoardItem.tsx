"use client";

import { deleteQuestion } from "@/actions/actionQna";
import { BoardItemById } from "@/app/libs/serverDb";
import Button from "@/components/Button/Button";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";

// 높이 조절 textarea 를 사용하려면 client에서만 가능하므로 별로도 만듬.
// 서버 컴포넌트에서 이걸 사용하는 방식으로 구현
export default function ViewOneBoardItem({
    oneQnA,
    id,
    page,
    // searchQuery,
    // totalPagesCnt,
}: {
    oneQnA: BoardItemById;
    id: number;
    page: number;
    // searchQuery: string;
    // totalPagesCnt: number;
}) {
    //TODO : 마지막 게시물을 삭제하는 경우, page parameter 를 -1 한것으로 해줘야 함
    const deleteQuestionWithId = deleteQuestion.bind(null, id, page);

    return (
        <div className=" max-w-3xl mx-auto ">
            {/* --------------------- */}
            <div className="flex flex-row border-b blue-grey-400">
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
                className="pt-4 pb-4 block w-full border-b blue-grey-400 "
                defaultValue={oneQnA.contents}
                // cacheMeasurements={true}
            ></TextareaAutosize>

            {/* --------------------- */}
            <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                <form action={deleteQuestionWithId}>
                    <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 bg-blue-700 text-gray-300 text-sm font-medium  rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        삭제
                    </button>
                </form>

                <Link href={`/qna/${id}/edit?page=${page}`}>
                    <Button>수정</Button>
                </Link>
            </div>
        </div>
    );
}
