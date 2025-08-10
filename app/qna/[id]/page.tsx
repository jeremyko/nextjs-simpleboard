import { fetchOneQnaById, getTotalPagesCount } from "@/app/libs/serverDb";
import BoardDataTable from "@/components/Table/BoardDataTable";
import Pagination from "@/components/Pagination/Pagination";
import { getPostsPerPage } from "@/global_const/global_const";
import Link from "next/link";
import { notFound } from "next/navigation";
import ViewOneBoardItem from "@/components/ui/OneBoardItem";
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
import { checkIsAuthenticated } from "@/app/libs/checkIsAuthenticated";

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
    // const action = searchParams?.action || "";
    const totalPagesCnt = await getTotalPagesCount(searchQuery, getPostsPerPage());

    console.log("[view] search query", searchQuery);
    // console.log("[view] current page", page);
    // console.log("[view] QnA ID:", id);
    // console.log("[view] action:", action);

    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    // console.log("qna data:", oneQnA);

    const isAuthenticated = await checkIsAuthenticated();
    // if (!isAuthenticated) {
    //     console.log("[개별게시물보기] 로그인 안된 상태로 접근함");
    // }
    const deleteQuestionWithId = deleteQuestion.bind(null, id, page);

    return (
        <div className="max-w-4xl mx-auto min-h-screen ">
            <div className="flex flex-col text-sm  mb-4 text-left ">
                <div className="rounded-md md:p-6">
                    {/* XXX ViewOneBoardItem 는 client 컴포넌트로 분리되어 사용. */}
                    <ViewOneBoardItem
                        oneQnA={oneQnA}
                        // id={id}
                        // page={page}
                        // searchQuery={searchQuery}
                        // totalPagesCnt={totalPagesCnt}
                    />

                    {isAuthenticated && (
                        <div className="mt-6 mb-6 flex justify-between items-center gap-4">
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
                                    <AlertDialogFooter>
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
                    ) }

                    {/* XXX BoardDataTable 이 server component 다. ViewOneBoardItem 내에서 호출 불가 !!! */}
                    <div className="mt-4 pb-2 flex justify-between items-center gap-4">comments</div>

                    <BoardDataTable searchQuery={searchQuery} currentPage={page} postsPerPage={getPostsPerPage()} currentPostId={id} />

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
