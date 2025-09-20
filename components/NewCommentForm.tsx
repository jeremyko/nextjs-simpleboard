"use client";

import { createComment, CommentState } from "@/actions/actionQna";
import { useActionState, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import QuillEditor, { PendingFile } from "./QuillEditor";
import type ReactQuillType from "react-quill-new";
import { Button } from "./ui/button";
import SubmitButton from "./SubmitButton";

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
    // console.debug("[NewCommentForm] render => currentPostId:", currentPostId, " / currUserId:", currUserId);
    const initialState: CommentState = { message: null, errors: {} , redirectTo:""};
    const createCommentWithParams = createComment.bind(
        null,
        currUserId ?? "",
        currentPostUserName ?? "",
        currentPage,
        searchQuery,
        currentPostId,
    );
    const [commentState, formAction, isPending] = useActionState(createCommentWithParams, initialState);
    const [contentState, setContentState] = useState("");
    const [isWriting, setIsWriting] = useState(false); // 입력란 클릭시 작성취소, 저장 버튼 보이기 
    const router = useRouter();

    function onClickTextArea() {
        if (!currUserId) {
            redirect("/api/auth/signin");
        }
        // 입력란 클릭시 작성취소, 저장 버튼 보이기 
        setIsWriting(true);
    }

    function cancelComment(e: React.MouseEvent<HTMLButtonElement>) {
        setContentState("");
        setIsWriting(false);
        quillRef.current?.getEditor().blur(); // 명시적으로 포커스 해제 한다. 
        // 포커스가 남아 있으면 더이상 포커스 입력을 감지못하고,
        // 삭제, 수정 버튼이 안 나타나는 경우가 발생하기 때문.
        e.preventDefault();
    }

    useEffect(() => {
        if (commentState?.redirectTo) {
            router.push(commentState.redirectTo);
            setContentState("");
            setIsWriting(false);
        }
    }, [commentState, router]);

    const quillRef = useRef<ReactQuillType | null>(null);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const handleSubmit = async (formData: FormData) => {
        // 파일 추가
        // console.debug("Submitting form : pendingFiles =>", pendingFiles);
        pendingFiles.forEach((pendingFile, i) => {
            formData.append(`${pendingFile.placeholderUrl}`, pendingFile.file);
        });
        setPendingFiles([]); // 이미지를 사용안한경우에도 이전에 올린 이미지가 중복 업로드 에러방지.
        return  formAction(formData);
    };

    return (
        <form action={handleSubmit}>
            {/* <label htmlFor="content" className="sr-only">
                댓글
            </label> */}
            <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <QuillEditor
                        ref={quillRef}
                        setPendingFiles={setPendingFiles}
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
                    <Button
                        className="block cursor-pointer p-2 text-sm font-bold bg-red-600 text-white  border rounded-sm hover:bg-red-700"
                        onClick={cancelComment}
                    >
                        작성취소
                    </Button>
                    <SubmitButton desc="저장" pendingDesc="저장 중입니다..." />
                </div>
            )}
        </form>
    );
}
