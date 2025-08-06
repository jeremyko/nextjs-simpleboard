import { fetchOneQnaById, getTotalPagesCount } from "@/app/libs/serverDb";
import BoardDataTable from "@/components/Table/BoardDataTable";
import Pagination from "@/components/Pagination/Pagination";
import { getPostsPerPage } from "@/global_const/global_const";
import Link from "next/link";
import { notFound } from "next/navigation";
import ViewOneBoardItem from "@/components/ui/OneBoardItem";
import { Button } from "@/components/ui/button";

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
    const totalPagesCnt = await getTotalPagesCount(searchQuery,getPostsPerPage());

    console.log("[view] search query", searchQuery);
    // console.log("[view] current page", page);
    // console.log("[view] QnA ID:", id);
    // console.log("[view] action:", action);

    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    // console.log("qna data:", oneQnA);

    return (
        <>
            <div className="max-w-3xl mx-auto ">
                <div className="flex flex-col text-sm  mb-4 text-left ">
                    <div className="rounded-md md:p-6">
                        {/* XXX ViewOneBoardItem 는 client 컴포넌트로 분리되어 사용. */}
                        <ViewOneBoardItem
                            oneQnA={oneQnA}
                            id={id}
                            page={page}
                            searchQuery={searchQuery}
                            // totalPagesCnt={totalPagesCnt}
                        />

                        {/* XXX BoardDataTable 이 server component 다. ViewOneBoardItem 내에서 호출 불가 !!! */}
                        <div className="pt-2 pb-2 flex justify-between items-center gap-4">comments</div>

                        <BoardDataTable searchQuery={searchQuery} currentPage={page} postsPerPage={getPostsPerPage()} />

                        <div className="flex justify-end items-center pt-4">
                            <Link href="/qna/new">
                                <Button>새 질문</Button>
                            </Link>
                        </div>

                        <Pagination totalPagesCnt={totalPagesCnt} isFromViewPage={true} />
                    </div>
                </div>
            </div>
        </>
    );
}
