"use client";
// 에러/로딩/성공 상태를 화면에 즉시 표시하려면 → Client Component + useActionState

import { deleteQuestion, DelQnAState } from "@/actions/actionQna";
import Link from "next/link";
import { useActionState, } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

//XXX 게시물 삭제 form

export default function DeleteQnaForm({
    id,
    page,
    userId,
    searchQuery,
}: {
    id: number;
    page: number;
    userId: string;
    searchQuery:string;
}) {
    const deleteQuestionWithId = deleteQuestion.bind(null, id, page, userId, searchQuery);
    const initialState: DelQnAState = { error: null };
    const [state, formAction] = useActionState(deleteQuestionWithId, initialState); // client component only

    return (
        <>
            {/* 에러 발생시 표시한다  */}
            <p aria-live="polite" className="bold font-lg text-red-600">
                {state?.error}
            </p>

            <div className="mt-2 mb-2 flex justify-end items-center gap-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        {/* 바깥에서 보이는 삭제 버튼 */}
                        <div className="block cursor-pointer p-2 text-sm font-bold bg-red-600 text-white  border rounded-sm hover:bg-red-700 ">
                            {" "}
                            삭제{" "}
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>정말 삭제 하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-end items-center gap-4">
                            <AlertDialogCancel className=" text-white bg-blue-600 hover:bg-blue-500 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                취소
                            </AlertDialogCancel>
                            <form action={formAction} id="deleteForm" name="deleteForm">
                                <AlertDialogAction
                                    type="submit"
                                    className="bg-red-800 hover:bg-red-700 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    삭제
                                </AlertDialogAction>
                            </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Link href={`/qna/edit/${id}?page=${page}&query=${searchQuery}`}>
                    {/* <Button>수정</Button> */}
                    <div className="block cursor-pointer p-2 text-sm font-bold bg-blue-500 text-white border rounded-sm hover:bg-blue-600">
                        수정
                    </div>
                </Link>
            </div>
        </>
    );
}