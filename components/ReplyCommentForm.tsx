"use client";

import { createReply, CommentState } from "@/actions/actionQna";
import { useActionState, useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import QuillEditor, { PendingFile } from "./QuillEditor";
import type ReactQuillType from "react-quill-new";
import { Button } from "./ui/button";
import SubmitButton from "./SubmitButton";

export default function ReplyCommentForm({
    currUserId, //현재 로그인한 사용자
    currentPostId,
    commentId, // 응답을 할 댓글의 id
    commentUserName,
    currentPage,
    searchQuery,
    setIsReplying,
}: {
    currUserId: string | null;
    currentPostId: number;
    commentId: number;
    commentUserName:string;
    currentPage: number;
    searchQuery: string;
    setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    // console.debug(
    //     "[ReplyCommentForm] currentPostId:",
    //     currentPostId,
    //     " / currUserId:",
    //     currUserId,
    //     " / commentId: ",
    //     commentId,
    // );
    const initialState: CommentState = { message: null, errors: {}, redirectTo:"" };
    const createReplyWithParams = createReply.bind(
        null,
        currUserId ?? "",
        commentId,
        commentUserName,
        currentPage,
        searchQuery,
        currentPostId,
    );
    const [replyState, formAction, isPending] = useActionState(createReplyWithParams, initialState);
    const [contentState, setContentState] = useState("");

    function onClickTextArea() {
        if (!currUserId) {
            redirect("/api/auth/signin");
        }
    }

    function cancelReply(e: React.MouseEvent<HTMLButtonElement>) {
        setContentState("");
        setIsReplying(false);
        setPendingFiles([]); 
        e.preventDefault(); // Form submission canceled because the form is not connected 경고 방지
    }

    const router = useRouter();
    useEffect(() => {
        if (replyState?.redirectTo) {
            router.push(replyState.redirectTo);
            setContentState("");
            setIsReplying(false);
        }
    }, [replyState, router, setIsReplying]);

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

    useEffect(() => {
        if (quillRef.current) {
            // const rect = scrollRef.current.getBoundingClientRect();
            // console.debug("상대 좌표:", rect);
            // console.debug("window.scrollY : ", window.scrollY);
            // console.debug("window.pageYOffset : ", window.pageYOffset);
            // console.debug("절대 y 좌표:", rect.top + window.pageYOffset);
            // window.scrollTo(0, rect.top + window.pageYOffset);
            quillRef.current.focus();
            // scrollRef.current.scrollIntoView({ behavior: "instant", block: "center" }); 
        }
    },[] );


    return (
        <div className="w-full mt-6 mb-4 ">
            <div className="ml-[20px] pl-4 border-dashed border-l-3 border-l-zinc-300 border-t-1 border-t-zinc-300">
                <form action={handleSubmit}>
                    {/* <label htmlFor="content" className="sr-only">
                        댓글
                    </label> */}
                    <div className="mt-2 rounded-md">
                        <div className="">
                            <QuillEditor
                                ref={quillRef}
                                setPendingFiles={setPendingFiles}
                                name="content"
                                theme="snow"
                                value={contentState}
                                isReadOnly={currUserId ? false : true}
                                onChange={(e) => setContentState(e)}
                                onFocus={onClickTextArea}
                                placeholder={
                                    !currUserId ? "댓글을 쓰려면 로그인이 필요합니다" : "댓글을 입력하세요"
                                }
                            />
                        </div>
                    </div>

                    {currUserId && (
                        <div className="flex justify-end items-center gap-4 mt-2">
                            <Button
                                className="block cursor-pointer p-2 text-sm font-bold bg-red-600 text-white  border rounded-sm hover:bg-red-700"
                                onClick={cancelReply}
                            >
                                작성취소
                            </Button>
                            <SubmitButton
                                desc="의견 남기기"
                                pendingDesc="저장 중입니다..."
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
