"use client";

import { deleteQuestion } from "@/actions/actionQna";
import { BoardItemById } from "@/app/libs/serverDb";
// import Button from "@/components/Button/Button";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";

// 높이 조절 textarea 를 사용하려면 client에서만 가능하므로 별로도 만듬.
// 서버 컴포넌트에서 이걸 사용하는 방식으로 구현
export default function ViewOneBoardItem({
    oneQnA,
    id,
    page,
    // searchQuery,
    // totalPagesCnt,
}: {
    oneQnA: BoardItemById;
    id: number;
    page: number;
    // searchQuery: string;
    // totalPagesCnt: number;
}) {
    //TODO : 마지막 게시물을 삭제하는 경우, page parameter 를 -1 한것으로 해줘야 함
    const deleteQuestionWithId = deleteQuestion.bind(null, id, page);

    return (
        <div className=" max-w-3xl mx-auto ">
            {/* --------------------- */}
            <div className="flex flex-row border-b border-gray-700">
                <label className="mt-2 mb-2 block font-light bg-gray-500 text-white pr-2 pl-2 rounded-sm ">
                    {oneQnA.category_name}
                </label>
                <label className="mt-2 ml-4 mb-2 block font-bold">{oneQnA.title}</label>
            </div>
            {/* <div className="pt-2 pb-2 border-b border-gray-600 ">{oneQnA.contents}</div> */}
            <TextareaAutosize
                // ref={textbox}
                // onChange={handleKeyDown}
                id="content"
                name="content"
                rows={10}
                readOnly={true}
                className="pt-4 pb-4 block w-full border-b border-gray-700 "
                defaultValue={oneQnA.contents}
                // cacheMeasurements={true}
            ></TextareaAutosize>

            {/* --------------------- */}
            <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                {/* <form action={deleteQuestionWithId}>
                    <Button type="submit" > 삭제 </Button>
                </form> */}
                <Dialog>
                    <DialogTrigger asChild>
                        {/* 바깥에서 보이는 삭제 버튼 */}
                        <Button> 삭제 </Button>
                    </DialogTrigger>
                    <DialogContent showCloseButton={false} className="bg-lime-200 sm:max-w-70 ">
                        <DialogHeader>
                            <DialogTitle>정말 삭제 하시겠습니까?</DialogTitle>
                            {/* <DialogDescription>
                                이 작업은 되돌릴 수 없습니다. 
                            </DialogDescription> */}
                        </DialogHeader>
                        {/* 모달 내에서 보이는 진짜 삭제 버튼 */}
                        <form action={deleteQuestionWithId}>
                            <div className="text-sm pr-10 pl-10 flex justify-between items-center pt-4 ">
                                <button
                                    type="submit"
                                    className="p-2 bg-red-700 text-zinc-100 rounded-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    {" "}
                                    삭 제{" "}
                                </button>
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        className="text-sm p-2 bg-gray-700 text-zinc-100 rounded-sm  hover:bg-gray-600 focus:outline-none focus:ring-2"
                                    >
                                        취 소
                                    </Button>
                                </DialogClose>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Link href={`/qna/${id}/edit?page=${page}`}>
                    <Button>수정</Button>
                </Link>
            </div>
        </div>
    );
}
