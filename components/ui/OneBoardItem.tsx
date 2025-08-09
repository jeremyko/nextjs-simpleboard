"use client";

import { BoardItemById } from "@/app/libs/serverDb";

// 높이 조절 textarea 를 사용하려면 client에서만 가능하므로 별로도 만듬.
// 서버 컴포넌트에서 이걸 사용하는 방식으로 구현
// TextareaAutosize 사용시 렌더링 지연이 발생되어 div 로 처리함
export default function ViewOneBoardItem({ oneQnA }: { oneQnA: BoardItemById }) {
    console.log("[ViewOneBoardItem] oneQnA:", oneQnA);
    //TODO : 마지막 게시물을 삭제하는 경우, page parameter 를 -1 한것으로 해줘야 함

    return (
        <div className=" max-w-4xl mx-auto ">
            {/* --------------------- */}
            <div className="border-b border-gray-700">
                <p id="title" className="mt-2 mb-2 block font-bold">
                    {oneQnA.title}
                </p>
            </div>
            <div className="flex flex-row justify-between items-center mt-2 mb-2">
                <p id="categoryName" className="font-light bg-gray-500 text-white pr-2 pl-2 rounded-sm ">
                    {oneQnA.category_name}
                </p>
            </div>
            <article style={{ whiteSpace: "pre-wrap" }} className="pb-4 w-full border-b border-gray-700 ">
                {oneQnA.contents}
            </article>
        </div>
    );
}
