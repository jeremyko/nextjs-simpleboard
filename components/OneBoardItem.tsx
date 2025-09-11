"use client";

import { BoardItemById } from "@/app/libs/serverDb";

// No SSR ==> CSR 처리 명시
import dynamic from "next/dynamic";
import QuillEditor from "./QuillEditor";
const Avatar = dynamic(() => import("./ui/avatar").then((mod) => mod.Avatar), { ssr: false });
const AvatarImage = dynamic(() => import("./ui/avatar").then((mod) => mod.AvatarImage), {
    ssr: false,
});

export default function OneBoardItem({ oneQnA }: { oneQnA: BoardItemById }) {
    // console.debug("OneBoardItem render");
    // console.debug("[ViewOneBoardItem] oneQnA:", oneQnA);

    return (
        <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
            <div className="flex flex-row justify-between items-center  ">
                <p
                    id="categoryName"
                    className="text-xs font-light bg-gray-500 text-white  mb-2 p-1  rounded-sm "
                >
                    {oneQnA.category_name}
                </p>
            </div>
            <div className="flex flex-row items-center gap-1 mb-4 pt-2 ">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={oneQnA.user_image ?? undefined} alt="" />
                </Avatar>
                <span className="text-sm font-semibold">{oneQnA.user_name}</span>
            </div>
            <div className="pb-5">
                <h1 id="title" className="mt-2 mb-2 block text-base font-semibold">
                    {oneQnA.title}
                </h1>
            </div>

            <QuillEditor
                className="quillViewModeNoPadding"
                name="content"
                theme="bubble"
                value={oneQnA.contents}
                isReadOnly={true}
                onChange={() => {}}
            />
        </div>
    );
}
