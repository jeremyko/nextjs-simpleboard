"use client";

import { createReply, CommentState } from "@/actions/actionQna";
import { useActionState, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function ReplyCommentForm({
    currUserId, //현재 로그인한 사용자
    // commentUserId, // 응답할 댓글의 작성자
    currentPostId,
    commentId, // 응답을 할 댓글의 id
    commentUserName,
    currentPage,
    searchQuery,
    setIsReplying,
}: {
    currUserId: string | null;
    // commentUserId: string;
    currentPostId: number;
    commentId: number;
    commentUserName:string;
    currentPage: number;
    searchQuery: string;
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    console.log(
        "[ReplyCommentForm] currentPostId:",
        currentPostId,
        " / currUserId:",
        currUserId,
        " / commentId: ",
        commentId,
    );
    const initialState: CommentState = { message: null, errors: {} };
    const createReplyWithParams = createReply.bind(
        null,
        currUserId ?? "",
        commentId,
        // commentUserId, // 응답할 댓글의 작성자
        commentUserName,
        currentPage,
        searchQuery,
        currentPostId,
    );
    const [state, formAction] = useActionState(createReplyWithParams, initialState);
    const [contentState, setContentState] = useState("");
    // const [isWriting, setIsWriting] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    // const [textAreaRows, setTextAreaRows] = useState(10);

    function onClickTextArea() {
        if (!currUserId) {
            redirect("/api/auth/signin");
        }
    }

    function cancelReply(e: React.MouseEvent<HTMLButtonElement>) {
        setContentState("");
        setIsReplying(false);
        e.preventDefault();
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
                        ref={inputRef}
                        id="content"
                        name="content"
                        // rows={textAreaRows}
                        className={`peer block w-full rounded-md py-2 pl-4 text-sm border 
                            border-zinc-400 outline-0 placeholder:text-gray-500 
                            focus:ring-1 focus:ring-blue-400`}
                        aria-describedby="qna-comments-error"
                        placeholder={!currUserId ? "댓글을 쓰려면 로그인이 필요합니다" : ""}
                        readOnly={currUserId ? false : true}
                        onClick={onClickTextArea}
                        value={contentState}
                        onChange={(e) => setContentState(e.target.value)}
                        required
                    ></TextareaAutosize>
                </div>
            </div>

            {currUserId && (
                <div className="flex justify-end items-center gap-4 ">
                    <div className="mt-2 pt-2 pb-2 ">
                        <Button variant="destructive" onClick={cancelReply}>
                            작성취소
                        </Button>
                    </div>
                    <div className="mt-2 pt-2 pb-2 ">
                        <Button type="submit"> 의견 남기기 </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
