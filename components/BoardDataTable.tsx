import { getAllPostsCount, fetchPagedBoardItems } from "@/app/libs/serverDb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export default async function BoardDataTable({
    searchQuery,
    currentPage,
    postsPerPage,
    currentPostId = -1, // 현재 보고있는 게시물 강조표시 위함
}: {
    searchQuery: string;
    currentPage: number;
    postsPerPage: number;
    currentPostId: number;
}) {
    // console.debug("currentPage(table)", currentPage);
    // console.debug("searchQuery(table)", searchQuery);
    // 한번에 두 개의 쿼리를 실행
    const data = await Promise.all([
        getAllPostsCount(searchQuery),
        fetchPagedBoardItems(currentPage, postsPerPage, searchQuery),
    ]);
    const totalPostCount = Number(data[0] ?? "0");
    // console.debug("totalPostCount", totalPostCount);
    // const totalPages = Math.ceil(totalPostCount / postsPerPage);
    // console.debug("totalPages", totalPages);
    const posts = data[1];
    // console.debug("posts:", posts);

    return (
        // <div className="max-w-3xl mx-auto min-h-screen ">
        <div className="max-w-3xl ">
            <div className="text-2xl font-bold pt-4 mb-4 text-left">
                <h1> Q&A </h1>
            </div>
            {searchQuery && (
                <div>
                    <div className="text-xl mt-4 mb-4">Search Results </div>
                    <div className="text-sm mb-2">Results for {searchQuery} </div>
                </div>
            )}
            {/* <Search placeholder="검색어를 입력하세요" /> */}
            {/* <table className=" w-full table-auto border-collapse  text-sm"> */}
            <table className=" w-full border-collapse text-sm font-light">
                {/* <thead>
                    <tr className="text-center border-b border-gray-700 bg-indigo-700 text-zinc-300 ">
                        <th className="p-2 font-medium">번호</th>
                        <th className="p-2 font-medium">분류</th>
                        <th className="p-2 font-medium">제목</th>
                        <th className="p-2 font-medium min-w-[130px]">작성자</th>
                        <th className="p-2 font-medium">날짜</th>
                        <th className="p-2 font-medium">조회수</th>
                    </tr>
                </thead> */}

                <tbody>
                    {posts?.map((post) => (
                        <tr
                            key={post.article_id}
                            className={
                                currentPostId === post.article_id
                                    ? "bg-slate-200  dark:bg-slate-700 border-b border-gray-500"
                                    : "border-b border-gray-500 "
                            }
                        >
                            <td className="p-2 text-xs font-light">
                                {currentPostId === post.article_id && (
                                    <FontAwesomeIcon
                                        size="sm"
                                        icon={faLocationDot}
                                        aria-label="current"
                                        className="text-red-500 pr-1"
                                    />
                                )}
                                <span className="hidden sm:block ">{post.rownum}</span>
                            </td>
                            <td className="p-2 text-xs hidden sm:block">
                                <div className="min-w-[30px] ">{post.category_name}</div>
                            </td>
                            <td className="p-2 text-left ">
                                {post.comment_count > 0 && (
                                    <span className="bg-gray-500 text-white pr-2 pl-2 rounded-sm  text-xs font-light mr-2">
                                        {post.comment_count}
                                    </span>
                                )}{" "}
                                <Link
                                    href={`/qna/${post.article_id}?page=${currentPage}&query=${searchQuery}`}
                                    className=" hover:underline text-sm "
                                >
                                    {/* {post.title.substring(0, 40) + "..."} */}
                                    <span>{post.title}</span>
                                </Link>
                            </td>
                            <td className="p-2  min-w-[100px] hidden sm:block ">
                                <div className="flex flex-row align-middle ">
                                    <Avatar className="h-4 w-4 ">
                                        <AvatarImage src={post.user_image ?? undefined} alt="" />
                                    </Avatar>
                                    <span className="text-xs font-light pl-1">{post.user_name}</span>
                                </div>
                            </td>
                            <td className="p-2 text-center min-w-[90px] text-xs font-light ">
                                {post.created}
                            </td>
                            <td className="p-2 text-center text-xs font-light hidden sm:block">
                                {post.views}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right text-sm  mt-4 mb-4">전체 {totalPostCount}개의 게시글 </div>
        </div>
    );
}
