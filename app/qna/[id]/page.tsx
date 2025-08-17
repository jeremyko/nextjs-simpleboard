import { fetchOneQnaById, getComments, getTotalPagesCount } from "@/app/libs/serverDb";
import BoardDataTable from "@/components/Table/BoardDataTable";
import Pagination from "@/components/Pagination/Pagination";
import { getPostsPerPage } from "@/global_const/global_const";
import Link from "next/link";
import { notFound } from "next/navigation";
import OneBoardItem from "@/components/OneBoardItem/OneBoardItem"; //TODO : 경로가 이게 맞는건지 ..
import { Button } from "@/components/ui/button";
import { deleteQuestion } from "@/actions/actionQna";
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
} from "@/components/ui/alert-dialog";
import { checkIsAuthenticated, getSessionUserId, isAuthenticatedAndMine } from "@/app/libs/dataAccessLayer";
import NewCommentForm from "@/components/Forms/NewCommentForm";
import OneCommentData from "@/components/OneCommentData/OneCommentData";

// XXX 개별 게시물 보기

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const params = await props.params;
    const id = Number(params.id);
    const searchParams = await props.searchParams;
    const searchQuery = decodeURIComponent(searchParams?.query || "");
    const page = Number(searchParams?.page) || 1;
    const totalPagesCnt = await getTotalPagesCount(searchQuery, getPostsPerPage());

    console.log("[view] 개별 게시물 보기");
    // console.log("[view] search query", searchQuery);
    // console.log("[view] current page", page);
    // console.log("[view] QnA ID:", id);
    // console.log("[view] action:", action);

    const currUserId = await getSessionUserId();
    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    const isLoggedInAndMine = await isAuthenticatedAndMine(oneQnA.user_id);
    const isLogged = await checkIsAuthenticated();
    const deleteQuestionWithId = deleteQuestion.bind(null, id, page, oneQnA.user_id);
    const comments = await getComments(oneQnA.article_id);
    // console.log("comments:", comments);

    return (
        <div className="max-w-3xl mx-auto min-h-screen ">
            <div className="flex flex-col text-sm  mb-4 text-left ">
                <div className="rounded-md md:p-3">
                    {/* XXX ViewOneBoardItem 는 client 컴포넌트로 분리되어 사용. */}
                    <OneBoardItem oneQnA={oneQnA} />

                    {isLoggedInAndMine && (
                        <div className="mt-6 mb-6 flex justify-end items-center gap-8">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    {/* 바깥에서 보이는 삭제 버튼 */}
                                    <Button variant="destructive"> 삭제 </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>정말 삭제 하시겠습니까?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your article.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex justify-end items-center gap-8">
                                        <AlertDialogCancel className=" text-white bg-blue-600 hover:bg-blue-500 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                            취소
                                        </AlertDialogCancel>
                                        <form action={deleteQuestionWithId} id="deleteForm" name="deleteForm">
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

                            <Link href={`/qna/edit/${id}?page=${page}&query=${searchQuery}`}>
                                <Button>수정</Button>
                            </Link>
                        </div>
                    )}

                    <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
                        <h2 id="notes-title" className="pl-1 font-semibold text-sm">
                            총 {comments.length}개의 댓글
                        </h2>
                        <NewCommentForm
                            userId={currUserId}
                            currentPostId={id}
                            currentPage={page}
                            searchQuery={searchQuery}
                        />

                        {/* comments 목록 표시  */}
                        <section className="mt-2">
                            {/* <ul className="divide-dashed divide-y divide-gray-400 " > */}
                            <ul className="divide divide-y divide-gray-400 ">
                                {comments.map((comment) => (
                                    <li
                                        key={comment.comment_id.toString()}
                                        // className="pt-2 "
                                    >
                                        <OneCommentData
                                            userId={currUserId}
                                            comment={comment}
                                            isMine={currUserId === comment.comment_user_id}
                                            currentPostId={id}
                                            currentPage={page}
                                            searchQuery={searchQuery}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* XXX BoardDataTable 이 server component 다. ViewOneBoardItem 내에서 호출 불가 !!! */}
                    <BoardDataTable
                        searchQuery={searchQuery}
                        currentPage={page}
                        postsPerPage={getPostsPerPage()}
                        currentPostId={id}
                    />

                    <div className="flex justify-end items-center pt-4">
                        <Link href="/qna/new">
                            <Button>새 질문</Button>
                        </Link>
                    </div>

                    <Pagination totalPagesCnt={totalPagesCnt} isFromViewPage={true} />
                </div>
            </div>
        </div>
    );
}
