"use client";

import { createQuestion, State } from "@/actions/actionQna";
import Button from "@/components/Button/component";
import Link from "next/link";
import { useActionState } from "react";

// 새 게시물 작성 form

export default function NewQuestionForm({ categoryList }: { categoryList: { category_id: number; name: string }[] } ) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createQuestion, initialState);
    return (
        <form action={formAction}>
            <div className="min-h-screen max-w-3xl mx-auto ">
                <div className="flex flex-col text-2xl p-4 mb-4 text-left ">
                    <h1> 질문 하기</h1>
                    <div className="rounded-md p-4 md:p-6">
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="category" className="mb-2 block text-sm font-bold">
                                분류
                            </label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="peer block w-full cursor-pointer rounded-md py-2 pl-4 text-sm outline-1 placeholder:text-gray-500"
                                    defaultValue=""
                                    aria-describedby="qna-category-error"
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
                                {state?.errors?.categoryId &&
                                    state?.errors.categoryId.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
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
                                        className="peer block w-full rounded-md  py-2 pl-4 text-sm outline-1 placeholder:text-gray-500"
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
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={20}
                                        className="peer block w-full rounded-md py-2 pl-4 text-sm outline-1 placeholder:text-gray-500"
                                        aria-describedby="qna-content-error"
                                        required
                                    ></textarea>
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

                        {/* --------------------- */}
                        <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                            <Link href="/qna">
                                <Button> 취소</Button>
                            </Link>

                            {/* 에러 ? */}
                            {/* <Link href="/qna" >
                            <Button type="submit"> 저장</Button>
                            </Link> */}

                            <button
                                type="submit"
                                className="cursor-pointer px-4 py-2 bg-blue-700 text-gray-300 text-sm font-medium  rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
