import BoardDataTable from "@/components/BoardDataTable/component";
import Pagination from "@/components/Pagination/component";
import { getAllPostsCount, getTotalPagesCount } from "../libs/api";

const POSTS_PER_PAGE = 3; // 페이지당 게시글 수

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
    }>;
}) {
    // 검색과 페이지네이션을 위한 쿼리 파라미터 처리
    const searchParams = await props.searchParams;
    const searchQuery = searchParams?.query || "";
    const page = Number(searchParams?.page) || 1;
    console.log("search query", searchQuery);
    console.log("current page", page);

    const totalPagesCnt = await getTotalPagesCount(POSTS_PER_PAGE);
    console.log("totalPages", totalPagesCnt);

    return (
        <div className="min-h-screen max-w-3xl mx-auto font-sans">
            <BoardDataTable searchQuery={searchQuery} currentPage={page} postsPerPage={POSTS_PER_PAGE} />
            <Pagination totalPagesCnt={totalPagesCnt} />
        </div>
    );
}
