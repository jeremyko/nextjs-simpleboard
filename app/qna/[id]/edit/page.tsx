import { fetchCategoryData, fetchOneQnaById } from "@/app/libs/serverDb";
import EditQuestionForm from "@/components/Forms/EditQuestionForm";
import { notFound } from "next/navigation";

// 개별 게시물 수정 페이지
export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}) {
    const params = await props.params;
    const id = Number(params.id);
    const searchParams = await props.searchParams;
    const searchQuery = decodeURIComponent(searchParams?.query || "");
    const page = Number(searchParams?.page) || 1;

    console.log("[edit] search query", searchQuery);
    console.log("[edit] current page", page);
    console.log("[edit] QnA ID:", id);

    //XXX 다시 한번 가져오게 일단 처리하자.. TODO : 어떤 좋은 방법이 있을까
    const oneQnA = await fetchOneQnaById(id);
    if (!oneQnA) {
        notFound();
    }
    const categoryList = await fetchCategoryData();
    if (!categoryList) {
        notFound();
    }

    // console.log("qna data:", oneQnA);
    return (
        <EditQuestionForm oneQnA={oneQnA} categoryList={categoryList} currentPage={page} searchQuery={searchQuery} />
    );
}
