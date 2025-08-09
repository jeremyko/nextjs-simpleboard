import { getAllPostsCount, fetchPagedBoardItems } from "@/app/libs/serverDb";
// import Search from "../Search/Search";

export default async function BoardDataTable({
    searchQuery,
    currentPage,
    postsPerPage,
}: {
    searchQuery: string;
    currentPage: number;
    postsPerPage: number;
}) {
    console.log("currentPage(table)", currentPage);
    console.log("searchQuery(table)", searchQuery);
    // 한번에 두 개의 쿼리를 실행
    const data = await Promise.all([
        getAllPostsCount(searchQuery),
        fetchPagedBoardItems( currentPage, postsPerPage, searchQuery)
    ]);
    console.log("data", data);
    const totalPostCount = Number(data[0] ?? '0');
    // console.log("totalPostCount", totalPostCount);
    // const totalPages = Math.ceil(totalPostCount / postsPerPage);
    // console.log("totalPages", totalPages);
    const posts = data[1];

    return (
        <div>
            <div className="text-2xl font-bold pt-4 mb-4 text-left">
                <h1> Q&A </h1>
            </div>
            {/* <Search placeholder="검색어를 입력하세요" /> */}
            <table className=" w-full table-auto border-collapse  text-sm">
                <thead>
                    <tr className="text-center border-b border-gray-700 bg-indigo-700 text-zinc-300 ">
                        <th className="p-2 font-medium">번호</th>
                        <th className="p-2 font-medium">분류</th>
                        <th className="p-2 font-medium">제목</th>
                        <th className="p-2 font-medium">날짜</th>
                        <th className="p-2 font-medium">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.article_id} className="border-b border-gray-700 ">
                            <td className="p-2 text-center font-light">{post.rownum}</td>
                            <td className="p-2 text-center">{post.category_name}</td>
                            <td className="p-2 text-left">
                                {post.comment_count > 0 && (
                                    <span className="bg-gray-500 text-white pr-2 pl-2 rounded-sm font-light mr-2">
                                        {post.comment_count}
                                    </span>
                                )}
                                <a
                                    href={`/qna/${post.article_id}?page=${currentPage}&query=${searchQuery}`}
                                    className="text-gray-800 hover:underline"
                                >
                                    {post.title.substring(0, 50)+"..."}
                                </a>
                            </td>
                            <td className="p-2 text-center">{post.created}</td>
                            <td className="p-2 text-center">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right  mt-4 mb-4">전체 {totalPostCount}개의 게시글 </div>
        </div>
    );
}
