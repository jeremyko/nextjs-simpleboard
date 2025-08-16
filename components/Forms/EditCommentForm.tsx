"use client";

//XXX 댓글 수정 form

import { CommentState, updateComment } from "@/actions/actionQna";
import { OneComment } from "@/app/libs/serverDb";
import { useActionState, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";

export default function EditCommentForm({
    userId,
    comment,
    currentPostId,
    currentPage,
    searchQuery,
    setIsEditing,
}: {
    userId?: string | null;
    comment: OneComment;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [contentState, setContentState] = useState(comment.comment);
    const initialState: CommentState = { message: null, errors: {} };
    const updateCommentWithParams = updateComment.bind(
        null,
        userId ?? "",
        currentPage,
        searchQuery,
        currentPostId,
        comment.comment_id,
    );
    const [state, formAction] = useActionState(updateCommentWithParams, initialState);

    function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
        setIsEditing(false);
        e.preventDefault(); // Form submission canceled because the form is not connected 경고 방지
    }

    return (
        <form action={formAction}>
            <div className="relative mt-2 rounded-md ">
                <div className="relative">
                    <TextareaAutosize
                        id="content"
                        name="content"
                        rows={1}
                        className="peer block w-full rounded-md py-2 pl-4 text-sm outline-1 placeholder:text-gray-500"
                        aria-describedby="qna-comments-error"
                        value={contentState}
                        onChange={(e) => setContentState(e.target.value)}
                        required
                    ></TextareaAutosize>
                </div>
                <div className="flex flex-row justify-between mt-4">
                    <Button
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
