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
import ReplyCommentForm from "../Forms/ReplyCommentForm";

// Comment 이건 이미 nextjs 가 사용중인 이름이라서 에러발생됨
export default function OneCommentData({
    // index,
    currUserId,
    comment,
    isMine,
    currentPostId,
    currentPage,
    searchQuery,
}: {
    // index:number;
    currUserId?: string | null;
    comment: OneComment;
    isMine: boolean;
    currentPostId: number;
    currentPage: number;
    searchQuery: string;
}) {
    // console.log("OneCommentData : currUserId=>", currUserId); 
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); //TODO 리렌더링 발생됨
    const [isReplying, setIsReplying] = useState(false); // 대댓글 작성 중 여부 TODO 리렌더링 문제
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

    // const depthPixel = (10 * comment.depth).toString();
    // console.log("index=>", index);
    // console.log("depthPixel=>", depthPixel);
    // console.log(`ml-[${depthPixel}px] ==>`, comment.comment);

    return (
        //TODO : 시간정보 표시. 10분전...
        <div
            className={
                comment.depth == 1
                    ? "border-t-2  border-zinc-300 mt-6"
                    : "ml-[20px] pl-4 border-dashed border-l-3 border-l-zinc-300 border-b-1 border-b-zinc-300 pb-4" 
            }
        >
            <div className="flex flex-row justify-between items-center gap-2 mb-4 font-sm pt-4 ">
                <div className="flex flex-row items-center gap-2 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.comment_user_image ?? undefined} alt="" />
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

                                <div className="w-full ">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild className="w-full">
                                            {/* 바깥에서 보이는 삭제 버튼 */}
                                            <Button className="px-4 py-2 hover:bg-blue-700 rounded-sm">
                                                삭제
                                            </Button>
                                            {/* <Button variant="destructive"> 삭제 </Button> */}
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>정말 삭제 하시겠습니까?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete
                                                    your article.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex justify-end items-center gap-8">
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
            {/* 댓글 본문 -------------------------------------------------- */}
            {/* 수정하는 경우 구분해서 .. */}
            {/* {!isEditing && <p className=""> {"@"+comment.reply_to+ " " + comment.comment} </p>} */}
            {!isEditing && (
                <p className="pb-4">
                    <span className="text-blue-700 font-bold">{"@" + comment.reply_to + " "}</span>
                    {comment.comment}
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

            {/* 대댓글 작성 ------------------------------------------------ */}
            {isReplying && currUserId && (
                <div className="w-full mt-6 mb-4 ">
                    <div className="ml-[20px] pl-4 border-dashed border-l-3 border-l-zinc-300 border-t-1 border-t-zinc-300">
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
                    </div>
                </div>
            )}
            {currUserId && !isReplying && (
                <div className="flex flex-row justify-start items-center gap-2 pt-6 ">
                    <a
                        href="#"
                        className="block p-1 hover:text-cyan-800 border rounded-sm hover:bg-blue-200"
                        onClick={() => setIsReplying(true)}
                    >
                        댓글 쓰기
                    </a>
                </div>
            )}
        </div>
    );
}
