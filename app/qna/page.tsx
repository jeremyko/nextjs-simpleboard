import BoardDataTable from "@/components/Table/boardList";
import Pagination from "@/components/Pagination/component";
import { getTotalPagesCount } from "../libs/serverDb";
import Button from "@/components/Button/component";
import Link from "next/link";
import { getPostsPerPage } from "@/global_const/global_const";

// 게시판 메인 페이지

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
    // 검색과 페이지네이션을 위한 쿼리 파라미터 처리
    const searchParams = await props.searchParams;
    const searchQuery = searchParams?.query || "";
    const page = Number(searchParams?.page) || 1;
    console.log("search query", searchQuery);
    console.log("current page", page);

    const totalPagesCnt = await getTotalPagesCount(10);
    // console.log("totalPages", totalPagesCnt);

    return (
        <div className="min-h-screen max-w-3xl mx-auto font-sans">
            <BoardDataTable searchQuery={searchQuery} currentPage={page} postsPerPage={getPostsPerPage()} />
            <div className="flex justify-between items-center p-4">
                <Link href="/qna/search">
                    <Button>검색</Button>
                </Link>
                <Link href="/qna/new">
                    <Button>새 질문</Button>
                </Link>
            </div>

            <Pagination totalPagesCnt={totalPagesCnt} />
        </div>
    );
}
