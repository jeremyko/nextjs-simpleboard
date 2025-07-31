import { fetchPagedBoardItems } from "@/app/libs/api";

const POSTS_PER_PAGE = 5; // 페이지당 게시글 수

export default async function BoardDataTable({ currentPage }: { currentPage: number }) {

    const posts = await fetchPagedBoardItems(currentPage);

    // console.log("posts", posts);    
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    console.log("currentPosts", currentPosts);    

    // const handlePageClick = (page: number) => {
    //     setCurrentPage(page);
    // };

    // const handlePrev = () => {
    //     if (currentPage > 1) setCurrentPage(currentPage - 1);
    // };

    // const handleNext = () => {
    //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    // };

    return (
        <div className="min-h-screen max-w-3xl mx-auto font-sans">
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
                    {currentPosts.map((post) => (
                        <tr key={post.article_id} className="border-b border-green-700 ">
                            <td className="p-3 text-center">{post.article_id}</td>
                            <td className="p-3 text-center">{post.category_name}</td>
                            <td className="p-3 text-left">
                                {/* TODO */}
                                {/* {post.comments > 0 && (
                                    <span className="bg-gray-500 text-white pr-2 pl-2 rounded-sm font-light mr-2">
                                        {post.comments}
                                    </span>
                                )} */}
                                <a href={`/post/${post.article_id}`} className="text-gray-800 hover:underline">
                                    {post.title}
                                </a>
                            </td>
                            <td className="p-3 text-center">{post.created}</td>
                            {/* TODO */}
                            <td className="p-3 text-center">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right  mt-8 mb-8">총 {posts.length}개의 게시글</div>
        </div>
    );
}
