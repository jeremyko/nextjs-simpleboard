"use client";

import { createReply, CommentState } from "@/actions/actionQna";
import { useActionState, useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import QuillEditor from "./QuillEditor";

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
    const [replyState, formAction] = useActionState(createReplyWithParams, initialState);
    const [contentState, setContentState] = useState("");
    const scrollRef = useRef<HTMLTextAreaElement | null>(null);

    function onClickTextArea() {
        if (!currUserId) {
            redirect("/api/auth/signin");
        }
    }

    function cancelReply(e: React.MouseEvent<HTMLDivElement>) {
        setContentState("");
        setIsReplying(false);
        e.preventDefault();
    }

    const router = useRouter();
    useEffect(() => {
        if (replyState?.redirectTo) {
            router.push(replyState.redirectTo);
            setContentState("");
            setIsReplying(false);
        }
    }, [replyState, router]);

    useEffect(() => {
        if (scrollRef.current) {
            // const rect = scrollRef.current.getBoundingClientRect();
            // console.debug("상대 좌표:", rect);
            // console.debug("window.scrollY : ", window.scrollY);
            // console.debug("window.pageYOffset : ", window.pageYOffset);
            // console.debug("절대 y 좌표:", rect.top + window.pageYOffset);
            // window.scrollTo(0, rect.top + window.pageYOffset);
            scrollRef.current.focus();
            // scrollRef.current.scrollIntoView({ behavior: "instant", block: "center" }); 
        }
    },[] );

    return (
        <div className="w-full mt-6 mb-4 ">
            <div className="ml-[20px] pl-4 border-dashed border-l-3 border-l-zinc-300 border-t-1 border-t-zinc-300">
                <form action={formAction}>
                    <label htmlFor="content" className="sr-only">
                        댓글
                    </label>
                    <div className="mt-2 rounded-md">
                        <div className="">
                            <QuillEditor
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
                            <div
                                className="block cursor-pointer p-2 text-sm font-bold bg-red-600 text-white  border rounded-sm hover:bg-red-700"
                                onClick={cancelReply}
                            >
                                작성취소
                            </div>
                            <input
                                type="submit"
                                value="의견 남기기"
                                className="block w-24 cursor-pointer p-2 text-sm font-bold bg-blue-500 text-white border rounded-sm hover:bg-blue-600"
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
