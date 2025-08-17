"use client";

import { updateQuestion, State } from "@/actions/actionQna";
import { BoardItemById } from "@/app/libs/serverDb";
import Link from "next/link";
import { useActionState, useLayoutEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";

//XXX 게시물 수정 form

export default function EditQuestionForm({
    oneQnA,
    categoryList,
    currentPage,
    searchQuery,
}: {
    oneQnA: BoardItemById;
    categoryList: { category_id: number; name: string }[];
    currentPage: number;
    searchQuery: string;
}) {
    console.log("[EditQuestionForm] searchQuery:", searchQuery);
    const initialState: State = { message: null, errors: {} };
    const updateQnaWithArticleId = updateQuestion.bind(null, oneQnA.user_id, oneQnA.article_id, currentPage, searchQuery);
    const [state, formAction] = useActionState(updateQnaWithArticleId, initialState);

    // 글입력시 자동 높이 조정 -----------------
    // const textbox = useRef<HTMLTextAreaElement>(null);
    // function adjustHeight() {
    //     console.log("adjustHeight called");
    //     if (textbox.current) {
    //         textbox.current.style.height = "inherit";
    //         textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    //     }
    // }
    // useLayoutEffect(adjustHeight, []);

    // function handleKeyDown() {
    //     adjustHeight();
    // }
    // 글입력시 자동 높이 조정 -----------------

    return (
        <form action={formAction}>
            <div className="min-h-screen max-w-3xl mx-auto  ">
                <div className="flex flex-col text-sm  p-4 mb-4 text-left ">
                    <div className="p-4 md:p-6">
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="categoryId" className="mb-2 block  font-bold">
                                분류
                            </label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="block w-full cursor-pointer rounded-md py-2 pl-2 border border-zinc-400 outline-0 focus:ring-1 focus:ring-blue-400"
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
                                        className="peer block w-full rounded-md  py-2 pl-2 border border-zinc-400 outline-0 focus:ring-1 focus:ring-blue-400 "
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
                                    <TextareaAutosize
                                        // ref={textbox}
                                        // onChange={handleKeyDown}
                                        id="content"
                                        name="content"
                                        rows={3}
                                        className=" mt-2 pt-2 block w-full py-2 pl-2 rounded-md border border-zinc-400 outline-0  focus:ring-1 focus:ring-blue-400"
                                        defaultValue={oneQnA.contents}
                                        aria-describedby="qna-content-error"
                                        required
                                    ></TextareaAutosize>
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
                        <div className="mt-6 pt-2 pb-2 flex justify-between items-center gap-4">
                            <Link href={`/qna/${oneQnA.article_id}?page=${currentPage}&query=${searchQuery}`}>
                                <Button> 취소</Button>
                            </Link>

                            <Button type="submit"> 저장 </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
