"use client";

import { BoardItemById } from "@/app/libs/serverDb";
import { Avatar, AvatarImage } from "./avatar";

// 높이 조절 textarea 를 사용하려면 client에서만 가능하므로 별로도 만듬.
// 서버 컴포넌트에서 이걸 사용하는 방식으로 구현
// TextareaAutosize 사용시 렌더링 지연이 발생되어 div 로 처리함
export default function ViewOneBoardItem({ oneQnA }: { oneQnA: BoardItemById }) {
    // console.log("[ViewOneBoardItem] oneQnA:", oneQnA);
    //TODO : 마지막 게시물을 삭제하는 경우, page parameter 를 -1 한것으로 해줘야 함

    return (
        <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
            <div className="flex flex-row justify-between items-center  ">
                <p id="categoryName" className="font-light bg-gray-500 text-white  mb-2 pr-2 pl-2 rounded-sm ">
                    {oneQnA.category_name}
                </p>
            </div>
            <div className="flex flex-row items-center gap-2 mb-8">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={oneQnA.user_image ?? undefined} />
                </Avatar>
                <span className="text-base font-bold">{oneQnA.user_name}</span>
            </div>
            <div className="pb-5">
                <h1 id="title" className="mt-2 mb-2 block text-3xl font-bold">
                    {oneQnA.title}
                </h1>
            </div>
            <article style={{ whiteSpace: "pre-wrap" }} className="pb-2 w-full  ">
                {oneQnA.contents}
            </article>
        </div>
    );
}
