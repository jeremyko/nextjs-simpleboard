"use client";

import { createComment, CommentState } from "@/actions/actionQna";
import { useActionState, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import QuillEditor from "./QuillEditor";

export default function NewCommentForm({
    currUserId,
    currentPostUserName,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    currUserId: string | null;
    currentPostUserName: string | null;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.debug("[NewCommentForm] currentPostId:", currentPostId, " / currUserId:", currUserId);
    const initialState: CommentState = { message: null, errors: {} , redirectTo:""};
    const createCommentWithParams = createComment.bind(
        null,
        currUserId ?? "",
        currentPostUserName ?? "",
        currentPage,
        searchQuery,
        currentPostId,
    );
    const [commentState, formAction] = useActionState(createCommentWithParams, initialState);
    const [contentState, setContentState] = useState("");
    const [isWriting, setIsWriting] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const router = useRouter();

    function onClickTextArea() {
        if (!currUserId) {
            redirect("/api/auth/signin");
        }
        setIsWriting(true);
    }


    function cancelComment(e: React.MouseEvent<HTMLDivElement>) {
        setContentState("");
        setIsWriting(false);
        e.preventDefault();
    }

    useEffect(() => {
        if (commentState?.redirectTo) {
            router.push(commentState.redirectTo);
            setContentState("");
            setIsWriting(false);
        }
    }, [commentState, router]);


    return (
        // <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
        <form action={formAction}>
            <label htmlFor="content" className="sr-only">
                댓글
            </label>
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <QuillEditor
                        name="content"
                        theme="snow"
                        value={contentState}
                        isReadOnly={currUserId ? false : true}
                        onChange={(e) => setContentState(e)}
                        onFocus={onClickTextArea}
                        placeholder={!currUserId ? "댓글을 쓰려면 로그인이 필요합니다" : "댓글을 입력하세요"}
                    />
                </div>
            </div>

            {currUserId && isWriting && (
                <div className="flex justify-end items-center gap-4 mt-1">
                    <div
                        className="block cursor-pointer p-2 text-sm font-bold bg-red-600 text-white  border rounded-sm hover:bg-red-700"
                        onClick={cancelComment}
                    >
                        작성취소
                    </div>
                    <input
                        type="submit"
                        value="저장"
                        className="block w-20 cursor-pointer p-2 text-sm font-bold bg-blue-500 text-white border rounded-sm hover:bg-blue-600"
                    />
                </div>
            )}
        </form>
    );
}
