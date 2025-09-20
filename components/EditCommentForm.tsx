"use client";

//XXX 댓글 수정 form

import { CommentState, updateComment } from "@/actions/actionQna";
import { OneComment } from "@/app/libs/serverDb";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import QuillEditor, { PendingFile } from "./QuillEditor";
import type ReactQuillType from "react-quill-new";
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
    // 수정되기 전의 내용을 함께 전달한다. 이미지 삭제된것을 파악하기 위해.
    const updateCommentWithParams = updateComment.bind(
        null,
        currUserId ?? "",
        currentPage,
        searchQuery,
        currentPostId,
        comment.comment_id,
        comment.comment,
    );
    const [commentState, formAction, isPending] = useActionState(updateCommentWithParams, initialState);
    const router = useRouter();

    function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
        setIsEditing(false);
        setPendingFiles([]); 
        e.preventDefault(); // Form submission canceled because the form is not connected 경고 방지
    }

    useEffect(() => {
        if (commentState?.redirectTo) {
            router.push(commentState.redirectTo);
            setIsEditing(false);
        }
    }, [commentState, router, setIsEditing]);

    const quillRef = useRef<ReactQuillType | null>(null);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const handleSubmit = async (formData: FormData) => {
        // 파일 추가
        console.debug("Submitting form : pendingFiles =>", pendingFiles);
        pendingFiles.forEach((pendingFile, i) => {
            formData.append(`${pendingFile.placeholderUrl}`, pendingFile.file);
        });
        setPendingFiles([]); // 이미지를 사용안한경우에도 이전에 올린 이미지가 중복 업로드 에러방지.
        return  formAction(formData);
    };

    return (
        <form action={handleSubmit}>
            <div className="relative mt-2 rounded-md ">
                <div className="relative">
                    <QuillEditor
                        ref={quillRef}
                        setPendingFiles={setPendingFiles}
                        name="content"
                        theme="snow"
                        value={contentState}
                        isReadOnly={false}
                        onChange={(e) => setContentState(e)}
                    />
                </div>
                <div className="flex flex-row justify-end mt-2  gap-4">
                    <Button
                        variant="destructive"
                        className=" px-4 py-2 hover:bg-blue-700 rounded-sm"
                        onClick={onCancel}
                    >
                        취소
                    </Button>
                    <SubmitButton desc="저장" pendingDesc="저장 중입니다..." />
                </div>
            </div>
        </form>
    );
}
