import { fetchOneQnaById, getComments, getTotalPagesCount, insertPostViews } from "@/app/libs/serverDb";
import BoardDataTable from "@/components/BoardDataTable";
import Pagination from "@/components/Pagination";
import { getPostsPerPage } from "@/global_const/global_const";
import Link from "next/link";
import { notFound } from "next/navigation";
import OneBoardItem from "@/components/OneBoardItem"; //TODO : 경로가 이게 맞는건지 ..
import { Button } from "@/components/ui/button";
import { getSessionUserId, isAuthenticatedAndMine } from "@/app/libs/dataAccessLayer";
import NewCommentForm from "@/components/NewCommentForm";
import OneCommentReply from "@/components/OneCommentReply";
import { cookies } from "next/headers";
import ModifyDeleteQnaForm from "@/components/DeleteQnaForm";
import ScrollToTopButton from "@/components/ScrollToTopButton";

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

    // console.debug("[view] 개별 게시물 보기");
    // console.debug("[view] search query", searchQuery);
    // console.debug("[view] current page", page);
    // console.debug("[view] QnA ID:", id);
    // console.debug("[view] action:", action);

    const currUserId = await getSessionUserId();
    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    const isLoggedInAndMine = await isAuthenticatedAndMine(oneQnA.user_id);
    const comments = await getComments(oneQnA.article_id);

    // ----------------------------------------------- 조회수 관리
    const cookieStore = await cookies();
    const viewerIdForCnt = cookieStore.get("viewerIdForCnt")?.value;

    if (viewerIdForCnt) {
        // db 처리
        // - 로그인 안한 경우 session_id 가 동일하면 조회수가 증가 안함
        // - 로그인 된 경우, 동일 pc 라도 계정을 다르게 로그인을 하면 조회수가 증가된다.
        await insertPostViews(oneQnA.article_id, currUserId ?? "", viewerIdForCnt ?? "");
    }
    // ----------------------------------------------- 조회수 관리
    return (
        <div className="max-w-3xl mx-auto ">
            <div className="flex flex-col text-sm  mb-4 text-left ">
                <div className="rounded-md p-2 md:p-3">
                    {/* XXX ViewOneBoardItem 는 client 컴포넌트로 분리되어 사용. */}
                    <OneBoardItem oneQnA={oneQnA} />

                    {isLoggedInAndMine && (
                        // 수정, 삭제 버튼 표시 
                        // 에러를 화면에 표시하기 위해 client component 로 분리함 
                        <ModifyDeleteQnaForm
                            id={id}
                            page={page}
                            userId={oneQnA.user_id}
                            searchQuery={searchQuery}
                            content={oneQnA.contents}
                        />
                    )}

                    <div className=" max-w-3xl mx-auto mt-4 border border-gray-500 rounded-md p-4">
                        <h2 id="notes-title" className="pl-1 font-semibold text-sm">
                            총 {comments.length}개의 댓글
                        </h2>
                        <NewCommentForm
                            currUserId={currUserId}
                            currentPostUserName={oneQnA.user_name}
                            currentPostId={id}
                            currentPage={page}
                            searchQuery={searchQuery}
                        />

                        {/* comment, reply 표시  */}
                        <section className="mt-2">
                            <ul>
                                {comments.map((comment, index) => (
                                    <li
                                        key={comment.comment_id.toString()}
                                        // className="pt-2 "
                                    >
                                        <OneCommentReply
                                            currUserId={currUserId}
                                            comment={comment}
                                            isPostMine={oneQnA.user_id === comment.comment_user_id}
                                            isCommentMine={currUserId === comment.comment_user_id}
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

                    <ScrollToTopButton />
                    <Pagination totalPagesCnt={totalPagesCnt} isFromViewPage={true} />
                </div>
            </div>
        </div>
    );
}
