import { fetchCategoryData, fetchOneQnaById } from "@/app/libs/serverDb";
import EditQuestionForm from "@/components/EditQuestionForm";
import { notFound } from "next/navigation";

// 개별 게시물 수정 페이지
export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}) {

    //middleware 에서 이미 필터링되므로 코드는 실행안됨.
    // const isAuthenticated = await checkIsAuthenticated();
    // if (!isAuthenticated) {
    //     console.debug("[edit qna] 로그인 안된 상태로 접근함");
    //     redirect("/api/auth/signin");
    // }
    const params = await props.params;
    const id = Number(params.id);
    const searchParams = await props.searchParams;
    const searchQuery = decodeURIComponent(searchParams?.query || "");
    const page = Number(searchParams?.page) || 1;

    // console.debug("[edit] search query", searchQuery);
    // console.debug("[edit] current page", page);
    // console.debug("[edit] QnA ID:", id);

    //XXX 다시 한번 가져오게 일단 처리하자.. TODO : 어떤 좋은 방법이 있을까
    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    const categoryList = await fetchCategoryData();
    if (!categoryList) {
        notFound();
    }

    // console.debug("qna data:", oneQnA);
    return (
        <EditQuestionForm oneQnA={oneQnA} categoryList={categoryList} currentPage={page} searchQuery={searchQuery} />
    );
}
