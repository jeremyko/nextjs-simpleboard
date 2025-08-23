import { fetchCategoryData } from "@/app/libs/serverDb";
import NewQuestionForm from "@/components/Forms/NewQuestionForm";
import { notFound } from "next/navigation";

// 새 게시물 작성 페이지

export default async function Page() {
    const categoryList = await fetchCategoryData();
    if (!categoryList) {
        notFound();
    }
    // console.log("categoryList", categoryList);
    return (
        <NewQuestionForm categoryList={categoryList}/>
    );
}
