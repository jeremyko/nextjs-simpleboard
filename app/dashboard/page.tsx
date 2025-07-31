import BoardDataTable from "@/components/BoardDataTable/component";
import Pagination from "@/components/Pagination/component";
import { getAllPostsCount, getTotalPagesCount } from "../libs/api";

const POSTS_PER_PAGE = 9; // 페이지당 게시글 수

export default async function Page() {
    const totalPagesCnt = await getTotalPagesCount(POSTS_PER_PAGE);
    console.log("totalPages", totalPagesCnt);  
    return (
        <div className="min-h-screen max-w-3xl mx-auto font-sans">
            <BoardDataTable currentPage={1} postsPerPage={POSTS_PER_PAGE} />
            <Pagination totalPagesCnt={totalPagesCnt} />
        </div>
    );
}
