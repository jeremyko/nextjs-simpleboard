"use client";

//XXX 댓글 수정 form

import { CommentState, updateComment } from "@/actions/actionQna";
import { OneComment } from "@/app/libs/serverDb";
import { useActionState, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function EditCommentForm({
    currUserId,
    comment,
    currentPostId,
    currentPage,
    searchQuery,
    setIsEditing,
}: {
    currUserId?: string | null;
    comment: OneComment;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    // console.debug("EditCommentForm");
    const [contentState, setContentState] = useState(comment.comment);
    const initialState: CommentState = { message: null, errors: {} };
    const updateCommentWithParams = updateComment.bind(
        null,
        currUserId ?? "",
        currentPage,
        searchQuery,
        currentPostId,
        comment.comment_id,
    );
    const [commentState, formAction] = useActionState(updateCommentWithParams, initialState);
    const router = useRouter();

    function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
        setIsEditing(false);
        e.preventDefault(); // Form submission canceled because the form is not connected 경고 방지
    }

    useEffect(() => {
        if (commentState?.redirectTo) {
            router.push(commentState.redirectTo);
            setIsEditing(false);
        }
    }, [commentState, router]);

    return (
        <form action={formAction}>
            <div className="relative mt-2 rounded-md ">
                <div className="relative">
                    <TextareaAutosize
                        id="content"
                        name="content"
                        rows={1}
                        className="peer block w-full rounded-md py-2 pl-4 text-sm border border-zinc-400 outline-0 placeholder:text-gray-500 focus:ring-1 focus:ring-blue-400"
                        aria-describedby="qna-comments-error"
                        value={contentState}
                        onChange={(e) => setContentState(e.target.value)}
                        required
                    ></TextareaAutosize>
                </div>
                <div className="flex flex-row justify-end mt-2  gap-4">
                    <Button
                        variant="destructive"
                        className=" px-4 py-2 hover:bg-blue-700 rounded-sm"
                        onClick={onCancel}
                    >
                        취소
                    </Button>
                    <Button type="submit"> 저장 </Button>
                </div>
            </div>
        </form>
    );
}
