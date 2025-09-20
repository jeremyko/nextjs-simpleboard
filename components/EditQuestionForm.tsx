"use client";

import { updateQuestion, State } from "@/actions/actionQna";
import { BoardItemById } from "@/app/libs/serverDb";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SubmitButton from "./SubmitButton";
import type ReactQuillType from "react-quill-new";
import QuillEditor, { PendingFile } from "./QuillEditor";

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
    // console.debug("[EditQuestionForm] render :", searchQuery);
    const initialState: State = { message: null, errors: {} };
    // 수정되기 전의 내용을 함께 전달한다. 이미지 삭제된것을 파악하기 위해.
    const updateQnaWithArticleId = updateQuestion.bind(null, oneQnA.user_id, oneQnA.article_id, currentPage, searchQuery, oneQnA.contents );
    const [state, formAction, isPending] = useActionState(updateQnaWithArticleId, initialState);

    const [content, setContent] = useState(oneQnA.contents);
    const handleEditorChange = (value: string) => {
        setContent(value); // 상태 업데이트
    };
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
                                        <option
                                            key={category.name}
                                            value={category.category_id}
                                            className="bg-gray-100  dark:bg-slate-700"
                                        >
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
                                    <QuillEditor
                                        ref={quillRef}
                                        setPendingFiles={setPendingFiles}
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
                        {/* <p aria-live="polite" className="bold font-lg text-red-600">{JSON.stringify(state?.errors?.categoryId)}</p> */}

                        {/* --------------------- */}
                        <div className="mt-6 pt-2 pb-2 flex justify-end items-center gap-2">
                            <Link href={`/qna/${oneQnA.article_id}?page=${currentPage}&query=${searchQuery}`}>
                                <Button variant="destructive"> 취소</Button>
                            </Link>

                            <SubmitButton desc="저장" pendingDesc="저장 중입니다..." />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
