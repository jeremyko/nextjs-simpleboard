import { getAllPostsCount, fetchPagedBoardItems } from "@/app/libs/api";

export default async function BoardDataTable({
    searchQuery,
    currentPage,
    postsPerPage,
}: {
    searchQuery?: string;
    currentPage: number;
    postsPerPage: number;
}) {
    // 한번에 두 개의 쿼리를 실행
    const data = await Promise.all([
        getAllPostsCount(),
        fetchPagedBoardItems(currentPage, postsPerPage)
    ]);
    console.log("data", data);
    const totalPostCount = Number(data[0] ?? '0');
    console.log("totalPostCount", totalPostCount);
    const totalPages = Math.ceil(totalPostCount / postsPerPage);
    console.log("totalPages", totalPages);
    const posts = data[1];

    // const posts = await fetchPagedBoardItems(currentPage, postsPerPage);

    const startIndex = (currentPage - 1) * postsPerPage;
    // const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);


    return (
        // <div className="min-h-screen max-w-3xl mx-auto font-sans">
        <div>
            <div className="text-2xl font-bold p-4 mb-4 text-left">
                <h1> Q&A </h1>
            </div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-green-700">
                        <th className="p-3 text-center">번호</th>
                        <th className="p-3 text-center">분류</th>
                        <th className="p-3 text-center">제목</th>
                        <th className="p-3 text-center">날짜</th>
                        <th className="p-3 text-center">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.article_id} className="border-b border-green-700 ">
                            <td className="p-3 text-center">{post.article_id}</td>
                            <td className="p-3 text-center">{post.category_name}</td>
                            <td className="p-3 text-left">
                                {post.comment_count > 0 && (
                                    <span className="bg-gray-500 text-white pr-2 pl-2 rounded-sm font-light mr-2">
                                        {post.comment_count}
                                    </span>
                                )}
                                <a href={`/qna/${post.article_id}`} className="text-gray-800 hover:underline">
                                    {post.title}
                                </a>
                            </td>
                            <td className="p-3 text-center">{post.created}</td>
                            <td className="p-3 text-center">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right  mt-8 mb-8">전체 {totalPostCount}개의 게시글 중 {postsPerPage} 개 표시 </div>
        </div>
    );
}
