"use client";

//XXX 댓글 수정 form

import { CommentState, updateComment } from "@/actions/actionQna";
import { OneComment } from "@/app/libs/serverDb";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import QuillEditor from "./QuillEditor";
import SubmitButton from "./SubmitButton";

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
    const [commentState, formAction, isPending] = useActionState(updateCommentWithParams, initialState);
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
    }, [commentState, router, setIsEditing]);

    return (
        <form action={formAction}>
            <div className="relative mt-2 rounded-md ">
                <div className="relative">
                    <QuillEditor
                        // className="quillViewModeNoPadding"
                        name="content"
                        theme="snow"
                        value={contentState}
                        isReadOnly={false}
                        onChange={(e) => setContentState(e)}
                    />
                </div>
                {isPending && <p className="text-blue-600">변경 중입니다...</p>}
                <div className="flex flex-row justify-end mt-2  gap-4">
                    <Button
                        variant="destructive"
                        className=" px-4 py-2 hover:bg-blue-700 rounded-sm"
                        onClick={onCancel}
                    >
                        취소
                    </Button>
                    <SubmitButton
                        desc="저장"
                        pendingDesc="저장 중입니다..."
                    />
                </div>
            </div>
        </form>
    );
}
