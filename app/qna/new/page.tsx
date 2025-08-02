"use client";

import { createQuestion, State } from "@/actions/qna";
import Button from "@/components/Button/component";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
    const initialState: State = { message: null, errors: { } };
    const [state, formAction] = useActionState(createQuestion, initialState);

    return (
        <form action={formAction}>
            <div className="min-h-screen max-w-3xl mx-auto font-sans ">
                <div className="flex flex-col text-2xl font-bold p-4 mb-4 text-left ">
                    <h1> 질문 하기</h1>
                    <div className="rounded-md p-4 md:p-6">
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="category" className="mb-2 block text-sm font-medium">
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
                                    {/* TODO */}
                                    <option value="1">기술</option>
                                    <option value="2">커리어</option>
                                    <option value="3">기타</option>
                                    {/* {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))} */}
                                </select>
                            </div>
                            {/* <div id="qna-category-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.customerId &&
                                    state?.errors.customerId.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div> */}
                        </div>

                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="title" className="mb-2 block text-sm font-medium">
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
                                        required
                                    ></input>
                                </div>
                            </div>
                        </div>
                        {/* --------------------- */}
                        <div className="mb-4">
                            <label htmlFor="content" className="mb-2 block text-sm font-medium">
                                본문
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={5}
                                        className="peer block w-full rounded-md py-2 pl-4 text-sm outline-1 placeholder:text-gray-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* --------------------- */}
                        <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                            <Button href="/qna"> 취소</Button>
                            <Button type="submit"> 저장</Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
