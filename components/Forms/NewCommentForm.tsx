"use client";

import { createComment, CommentState } from "@/actions/actionQna";
import { useActionState} from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function NewCommentForm({
    userId,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    userId: string|null;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.log("[NewCommentForm] currentPostId:", currentPostId, " / userId:",userId);
    // if (!userId) {
    //     redirect("/api/auth/signin");
    // }
    const initialState: CommentState = { message: null, errors: {} };
    const createCommentWithParams = createComment.bind(null, userId ?? "", currentPage, searchQuery, currentPostId);
    const [state, formAction] = useActionState(createCommentWithParams, initialState);

    function onClickTextArea(){
        // console.log("clicked area");
        if(!userId){
            redirect("/api/auth/signin");
        }
    }

    return (
        // <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
        <form action={formAction}>
            <label htmlFor="content" className="sr-only">
                댓글
            </label>
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <TextareaAutosize
                        // ref={textbox}
                        // onChange={handleKeyDown}
                        id="content"
                        name="content"
                        rows={1}
                        className="peer block w-full rounded-md py-2 pl-4 text-sm border border-zinc-400 outline-0 placeholder:text-gray-500 focus:ring-1 focus:ring-blue-400"
                        // className="block w-full resize-none rounded-md border border-gray-500  text-base shadow-sm  "
                        aria-describedby="qna-comments-error"
                        placeholder={!userId ? "댓글을 쓰려면 로그인이 필요합니다" : ""}
                        readOnly={userId ? false : true}
                        onClick={onClickTextArea}
                        required
                    ></TextareaAutosize>
                </div>
            </div>
            {/* <p className="group absolute left-2 top-2.5 inline-flex items-start space-x-1 text-sm text-gray-500 ">
                <span className="text-sm text-gray-500">
                    댓글을 쓰려면{" "}
                    <a
                        rel="nofollow"
                        className="font-bold underline"
                        href="/login?returnUrl=%2Farticles%2F1540976%3Ftopic%3Dlife%26page%3D1"
                    >
                        로그인
                    </a>
                    이 필요합니다.
                </span>
            </p> */}
            {/* </div> */}
            <div className="mt-2 pt-2 pb-2 flex justify-end items-center gap-4">
                <Button type="submit"> 저장 </Button>
            </div>
        </form>
    );
}
