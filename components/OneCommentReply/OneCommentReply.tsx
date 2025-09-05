"use client";

// comment, reply 같이 사용중임.
// comment 하나 당 메뉴버튼을 동작하기 위해 별도 component 로 만듬
import { OneComment } from "@/app/libs/serverDb";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { deleteComment  } from "@/actions/actionQna";
import { Button } from "../ui/button";
import EditCommentForm from "../Forms/EditCommentForm";
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
} from "../ui/alert-dialog";
import ReplyCommentForm from "../Forms/ReplyCommentForm";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Comment 이건 이미 nextjs 가 사용중인 이름이라서 에러발생됨
export default function OneCommentReply({
    // index,
    currUserId,
    comment,
    isPostMine,
    isCommentMine,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    // index:number;
    currUserId?: string | null;
    comment: OneComment;
    isPostMine: boolean;
    isCommentMine: boolean;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.debug("OneCommentReply : currUserId=>", currUserId);
    // console.debug("OneCommentData : comment.comment_user_id=>", comment.comment_user_id);
    // console.debug("OneCommentData : isPostMine=>", isPostMine);
    // console.debug("OneCommentData : isCommentMine=>", isCommentMine);
    const [isOpen, setIsOpen] = useState(false); //comment 수정,삭제를 보여주기 위함
    const [isEditing, setIsEditing] = useState(false); 
    const [isReplying, setIsReplying] = useState(false); 

    const router = useRouter();
    async function deleteCommentWithParams() {
        const result = await deleteComment(
            comment.comment_user_id,
            currentPage,
            searchQuery,
            currentPostId,
            comment.comment_id,
        );
        if (result?.redirectTo) {
            router.push(result.redirectTo); // soft navigation → 깜박임 없음
        }
    }

    const [dlgOpen, setDlgOpen] = useState(false);

    return (
        <div
            className={
                comment.depth == 1
                    ? "border-t-2  border-zinc-300 mt-4"
                    : "ml-[20px] pl-4 border-dashed border-l-3 border-l-zinc-300 border-b-1 border-b-zinc-300 pb-4"
            }
        >
            <div className="flex flex-row justify-between items-center gap-2 font-sm pt-2 ">
                <div className="flex flex-row items-center gap-2 ">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.comment_user_image ?? undefined} alt="" />
                    </Avatar>
                    <span className=" text-sm font-semibold">{comment.comment_user_name}</span>

                    {isPostMine && (
                        <>
                            -
                            <span className="rounded-sm bg-sky-500/20 px-1 text-[10px] font-thin sm:rounded-md sm:px-1.5">
                                작성자
                            </span>
                        </>
                    )}
                </div>
                {/* 내가 작성한것일때만 수정,삭제 기능 활성화 */}
                {isCommentMine && (
                    <div>
                        <div className="flex flex-row justify-end items-center gap-2 ">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-12 rounded">
                                        <FontAwesomeIcon
                                            size="xl" // "2xs" | "xs" | "sm" | "lg" | "xl" | "2xl"
                                            icon={faEllipsis}
                                            aria-label="commentMenu"
                                            className="p-2 text-cyan-700 hover:bg-gray-300 hover:text-cyan-600 rounded-sm"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-10" align="end" forceMount>
                                    <DropdownMenuItem
                                        className=" w-full px-2 py-2 hover:bg-blue-700 rounded-sm text-sm font-thin"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        수정
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className=" w-full px-2 py-2 hover:bg-blue-700 rounded-sm text-sm font-thin"
                                        onClick={() => setDlgOpen(true)}
                                    >
                                        삭제
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* AlertDialog 는 DropdownMenu 외부에 위치시켜야 함 */}

                            <AlertDialog open={dlgOpen} onOpenChange={setDlgOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>정말 삭제 하시겠습니까?</AlertDialogTitle>
                                        <AlertDialogDescription></AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter >
                                        <AlertDialogCancel
                                            onClick={() => setDlgOpen(false)}
                                            className=" text-white bg-blue-600 hover:bg-blue-500 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            취소
                                        </AlertDialogCancel>
                                        <form
                                            action={deleteCommentWithParams}
                                            id="deleteCommentForm"
                                            name="deleteCommentForm"
                                        >
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
                        </div>
                    </div>
                )}
            </div>
            {/* 댓글 본문 -------------------------------------------------- */}
            {/* 수정하는 경우 구분해서 .. */}
            {!isEditing && (
                <p className="pt-2 pb-2">
                    <span className="text-blue-700 dark:text-blue-400 text-sm font-bold">{"@" + comment.reply_to + " "}</span>
                    <span className="text-sm font-normal "> {comment.comment}</span>
                </p>
            )}
            {/* <p> depth : {comment.depth} </p>  */}
            {/* 수정하는 경우에만 보여준다 */}
            {/* 별도 component로 분리 : 입력할때마다 렌더링 발생 방지  */}
            {isEditing && (
                <EditCommentForm
                    currUserId={currUserId}
                    comment={comment}
                    currentPostId={currentPostId}
                    currentPage={currentPage}
                    searchQuery={searchQuery}
                    setIsEditing={setIsEditing}
                ></EditCommentForm>
            )}
            {currUserId && !isReplying && (
                <div className="flex flex-row justify-start items-center gap-2">
                    <div
                        className="block cursor-pointer p-1 text-[10px] font-thin hover:text-cyan-800 border rounded-sm hover:bg-blue-200"
                        onClick={() => setIsReplying(true)}
                    >
                        댓글 쓰기
                    </div>
                </div>
            )}
            {/* 대댓글 작성 ------------------------------------------------ */}
            {isReplying && currUserId && (
                <ReplyCommentForm
                    currUserId={currUserId}
                    // commentUserId={comment.comment_user_id}
                    currentPostId={currentPostId}
                    commentId={comment.comment_id}
                    commentUserName={comment.comment_user_name}
                    currentPage={currentPage}
                    searchQuery={searchQuery}
                    setIsReplying={setIsReplying}
                />
            )}
        </div>
    );
}
