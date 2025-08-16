"use client";

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

// Comment 이건 이미 nextjs 가 사용중인 이름이라서 에러발생됨
export default function OneCommentData({
    userId,
    comment,
    isMine,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    userId?: string | null;
    comment: OneComment;
    isMine: boolean;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.log("OneCommentData : userId=>", userId);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const deleteCommentWithParams = deleteComment.bind(
        null,
        comment.comment_user_id,
        currentPage,
        searchQuery,
        currentPostId,
        comment.comment_id,
    );

    // const { status } = useSession();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         console.log("[Comments] 세션 만료 또는 로그아웃됨 (클라이언트) ");
    //         setIsLoggedIn(false);
    //     } else if (status === "authenticated") {
    //         console.log("[Comments] 세션 존재 (클라이언트) ");
    //         setIsLoggedIn(true);
    //     }
    // }, [status]);

    return (
        //TODO : 시간정보 표시. 10분전...
        <div>
            <div className="flex flex-row justify-between items-center gap-2 mb-4 font-sm">
                <div className="flex flex-row items-center gap-2 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.comment_user_image ?? undefined} />
                    </Avatar>
                    <span className="text-base font-semibold">{comment.comment_user_name}</span>
                </div>
                {/* 내가 작성한것일때만 수정,삭제 기능 활성화 */}
                {isMine && (
                    <div>
                        <div className="flex flex-row justify-end items-center gap-2 mb-4">
                            {/* <Link href="/" className="text-xl font-bold hover:underline mr-4"> */}
                            <FontAwesomeIcon
                                size="xl" // "2xs" | "xs" | "sm" | "lg" | "xl" | "2xl"
                                icon={faEllipsis}
                                aria-label="commentMenu"
                                className="p-2 text-cyan-700 hover:bg-gray-300 hover:text-cyan-600 rounded-sm"
                                onClick={() => setIsOpen(true)}
                                // onMouseEnter={() => setIsOpen(true)}
                                // onMouseLeave={() => setIsOpen(false)}
                            />
                            {/* </Link> */}
                            <div
                                // onMouseEnter={() => setIsOpen(true)}
                                onMouseLeave={() => setIsOpen(false)}
                                className={`
            flex flex-col justify-end items-center gap-1 -4
            absolute mt-2 w-24 bg-blue border border-zinc-200 rounded-sm shadow-gray-600 shadow-lg z-10
            transition-all duration-200 ease-out
            transform origin-bottom
            ${isOpen ? "bg-zinc-200/100  scale-100" : "opacity-0 scale-80 pointer-events-none"}
            `}
                            >
                                <Button
                                    className=" w-full px-4 py-2 hover:bg-blue-700 rounded-sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    수정
                                </Button>

                                <div className="w-full flex justify-between items-center gap-4">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild className="w-full">
                                            {/* 바깥에서 보이는 삭제 버튼 */}
                                            <Button className="px-4 py-2 hover:bg-blue-700 rounded-sm">삭제</Button>
                                            {/* <Button variant="destructive"> 삭제 </Button> */}
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>정말 삭제 하시겠습니까?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your
                                                    article.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    onClick={() => setIsOpen(false)}
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
                        </div>
                    </div>
                )}
            </div>

            {/* 수정하는 경우 구분해서 .. */}
            {!isEditing && <p className=""> {comment.comment} </p>}

            {/* 수정하는 경우에만 보여준다 */}
            {/* 별도 component로 분리 : 입력할때마다 렌더링 발생 방지  */}
            {isEditing && (
                <EditCommentForm
                    userId={userId}
                    comment={comment}
                    currentPostId={currentPostId}
                    currentPage={currentPage}
                    searchQuery={searchQuery}
                    setIsEditing={setIsEditing}
                ></EditCommentForm>
            )}

            {userId && (
                <div className="flex flex-row justify-end items-center gap-2 mt-2 mb-4">
                    <a href="#" className="block px-4 py-2 hover:text-cyan-600 rounded-sm">
                        댓글달기
                    </a>
                </div>
            )}
        </div>
    );
}
