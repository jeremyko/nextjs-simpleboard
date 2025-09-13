"use client";

import { createQuestion, State } from "@/actions/actionQna";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "./ui/button";
import QuillEditor from "./QuillEditor";
import SubmitButton from "./SubmitButton";

// 새 게시물 작성 form

export default function NewQuestionForm({ categoryList }: { categoryList: { category_id: number; name: string }[] } ) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(createQuestion, initialState);
    const [content, setContent] = useState("");

    const handleEditorChange = (value: string) => {
        setContent(value); // 상태 업데이트
    };

    return (
        <form action={formAction}>
            <div className="min-h-screen max-w-3xl mx-auto ">
                <div className="flex flex-col text-2xl p-4 mb-4 text-left ">
                    <h1> 질문 하기</h1>
                    <div className="rounded-md p-4 md:p-6">
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="categoryId" className="mb-2 block text-sm font-bold">
                                분류
                            </label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="peer block w-full cursor-pointer rounded-md py-2 pl-4 text-sm border border-zinc-400 outline-0 placeholder:text-gray-500 focus:ring-1 focus:ring-blue-400"
                                    defaultValue=""
                                    aria-describedby="qna-category-error"
                                    required
                                >
                                    <option value="" disabled>
                                        분류를 선택 하세요
                                    </option>
                                    {categoryList.map((category) => (
                                        <option key={category.name} value={category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* error handling */}
                            <div id="qna-category-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.categoryId && (
                                    <p className="mt-2 text-sm text-red-500">{"분류를 선택하세요"}</p>
                                )}
                                {/* {state?.errors?.categoryId &&
                                    state?.errors.categoryId.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {"분류를 선택하세요"}
                                        </p>
                                    ))} */}
                            </div>
                        </div>

                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="title" className="mb-2 block text-sm font-bold">
                                제목
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="peer block w-full rounded-md  py-2 pl-4 text-sm border border-zinc-400 outline-0 placeholder:text-gray-500 focus:ring-1 focus:ring-blue-400"
                                        placeholder="제목을 입력하세요"
                                        aria-describedby="qna-title-error"
                                        required
                                    ></input>
                                </div>
                            </div>
                            {/* error handling */}
                            <div id="qna-title-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.title &&
                                    state?.errors.title.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="content" className="mb-2 block text-sm font-bold">
                                본문
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <QuillEditor
                                        className=""
                                        name="content"
                                        theme="snow"
                                        value={content}
                                        isReadOnly={false}
                                        onChange={handleEditorChange}
                                    />
                                </div>
                            </div>
                            {/* error handling */}
                            <div id="qna-content-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.content &&
                                    state?.errors.content.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {/* 에러 발생시 표시한다  */}
                        {/* <p aria-live="polite" className="bold font-lg text-red-600">
                            {state?.message}
                        </p> */}

                        {isPending && <p className="text-blue-600 text-sm">저장 중입니다...</p>}
                        {/* --------------------- */}
                        <div className="mt-6 pt-2 pb-2 flex justify-between items-center gap-4">
                            <Link href="/qna">
                                <Button> 취소</Button>
                            </Link>

                            <SubmitButton
                                desc="저장"
                                pendingDesc="저장 중입니다..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
