"use client";

import { updateQuestion, State } from "@/actions/actionQna";
import { BoardItemById } from "@/app/libs/serverDb";
import Button from "@/components/Button/component";
import Link from "next/link";
import { useActionState } from "react";

// 게시물 수정 form

export default function EditQuestionForm({
    oneQnA,
    categoryList,
    currentPage,
}: {
    oneQnA: BoardItemById;
    categoryList: { category_id: number; name: string }[];
    currentPage: number;
}) {
    const initialState: State = { message: null, errors: {} };
    const updateQnaWithArticleId = updateQuestion.bind(null, oneQnA.article_id, currentPage);
    const [state, formAction] = useActionState(updateQnaWithArticleId, initialState);

    return (
        <form action={formAction}>
            <div className="min-h-screen max-w-3xl mx-auto  ">
                <div className="flex flex-col text-sm  p-4 mb-4 text-left ">
                    <h1 className="pl-4 text-2xl"> 질문 하기</h1>
                    <div className="p-4 md:p-6">
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="category" className="mb-2 block  font-bold">
                                분류
                            </label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="block w-full cursor-pointer rounded-md py-2 pl-2 outline-1 "
                                    defaultValue={oneQnA.category_id}
                                    aria-describedby="qna-category-error"
                                >
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
                            <label htmlFor="title" className="mb-2 block font-bold">
                                제목
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="peer block w-full rounded-md  py-2 pl-2 outline-1 "
                                        defaultValue={oneQnA.title}
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
                            <label htmlFor="content" className="mb-2 block font-bold">
                                본문
                            </label>
                            <div className="relative mt-2 ">
                                <div className="relative">
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={20}
                                        className=" mt-2 pt-2 block w-full py-2 pl-2 outline-1 "
                                        defaultValue={oneQnA.contents}
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

                            <button
                                type="submit"
                                className="cursor-pointer px-4 py-2 bg-blue-700 text-gray-300 text-sm font-medium  rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {" "}
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
