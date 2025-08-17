"use client";

import { createComment, CommentState } from "@/actions/actionQna";
import { useActionState, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function NewCommentForm({
    userId,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    userId: string | null;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.log("[NewCommentForm] currentPostId:", currentPostId, " / userId:", userId);
    const initialState: CommentState = { message: null, errors: {} };
    const createCommentWithParams = createComment.bind(null, userId ?? "", currentPage, searchQuery, currentPostId);
    const [state, formAction] = useActionState(createCommentWithParams, initialState);
    const [contentState, setContentState] = useState("");
    const [isWriting, setIsWriting] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    // const [textAreaRows, setTextAreaRows] = useState(10);

    function onClickTextArea() {
        if (!userId) {
            redirect("/api/auth/signin");
        }
        // 버튼을 표시하고, cancel 을 눌러야만 재초기화되게
        // stackoverflow 댓글 처럼 구현
        setIsWriting(true);

        // textarea row를 3정도 변경처리, 
        // if (inputRef.current) {
        //     console.log("inputRef.current.value.length=>", inputRef.current.value.length);
        //     inputRef.current.setSelectionRange(0, 0);
        // }
        // setContentState("\n\n\n");
    }

    function cancelComment(e: React.MouseEvent<HTMLButtonElement>) {
        setContentState("");
        setIsWriting(false);
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
                        className="peer block w-full rounded-md py-2 pl-4 text-sm border border-zinc-400 outline-0 placeholder:text-gray-500 focus:ring-1 focus:ring-blue-400"
                        aria-describedby="qna-comments-error"
                        placeholder={!userId ? "댓글을 쓰려면 로그인이 필요합니다" : ""}
                        readOnly={userId ? false : true}
                        onClick={onClickTextArea}
                        value={contentState}
                        onChange={(e) => setContentState(e.target.value)}
                        required
                    ></TextareaAutosize>
                </div>
            </div>

            {userId && isWriting && (
                <div className="flex justify-end items-center gap-4">
                    <div className="mt-2 pt-2 pb-2 ">
                        <Button variant="destructive" onClick={cancelComment}>
                            작성취소
                        </Button>
                    </div>
                    <div className="mt-2 pt-2 pb-2 ">
                        <Button type="submit"> 저장 </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
