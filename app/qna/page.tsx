import BoardDataTable from "@/components/Table/BoardDataTable";
import Pagination from "@/components/Pagination/Pagination";
import { getTotalPagesCount } from "../libs/serverDb";
import Link from "next/link";
import { getPostsPerPage } from "@/global_const/global_const";
import { Button } from "@/components/ui/button";

//XXX 게시판 메인 페이지

export default async function Page(props: {
    // props 인자 :
    // 객체이며, searchParams의 key를 가지고 있고.
    // value type은 Promise이고 resolve 시, query,page 로 구성된 객체를 리턴한다
    // (resolve 결과값의 타입)
    // https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional
    //     Example Route                       URL         params
    //     -------------                       ------      -----------
    //     app/shop/[slug]/page.js             /shop/1     Promise<{ slug: '1' }>
    //     app/shop/[category]/[item]/page.js  /shop/1/2   Promise<{ category: '1', item: '2' }>
    //     app/shop/[...slug]/page.js          /shop/1/2   Promise<{ slug: ['1', '2'] }>

    // https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
    //     Example URL         searchParams
    //     -----------         ------------
    //     /shop?a=1           Promise<{ a: '1' }>
    //     /shop?a=1&b=2       Promise<{ a: '1', b: '2' }>
    //     /shop?a=1&a=2       Promise<{ a: ['1', '2'] }>
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}) {
    //XXX 게시판 메인 페이지
    // 검색과 페이지네이션을 위한 쿼리 파라미터 처리
    const searchParams = await props.searchParams;
    const searchQuery = decodeURIComponent(searchParams?.query || "");
    const page = Number(searchParams?.page) || 1;
    console.log("[list] search query:", searchQuery);
    console.log("[list] current page:", page);

    const totalPagesCnt = await getTotalPagesCount(searchQuery,getPostsPerPage());
    console.log("[list] totalPages", totalPagesCnt);

    return (
        <div className="min-h-screen max-w-4xl mx-auto font-sans">
            <BoardDataTable
                searchQuery={searchQuery}
                currentPage={page}
                postsPerPage={getPostsPerPage()}
                currentPostId={-1}
            />
            <div className="flex justify-end items-center ">
                <Link href="/qna/new">
                    <Button>글쓰기</Button>
                </Link>
            </div>

            <Pagination totalPagesCnt={totalPagesCnt} />
        </div>
    );
}
