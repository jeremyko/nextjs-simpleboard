import Button from "@/components/Button/Button";
import Link from "next/link";

// 개별 게시물 삭제 페이지
export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>
}) {
    const params = await props.params;
    const id = params.id;
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;

    console.log("current page", page);
    console.log("QnA ID:", id);

    return (
        <div className="min-h-screen max-w-3xl mx-auto ">
            edit page
            <div className="min-h-screen max-w-3xl mx-auto font-sans">
                <div className="flex justify-between items-center p-4">
                    <Link href="/qna">
                        <Button>취소</Button>
                        {/* TODO : 게시글 보기로 돌아가기 */}
                    </Link>
                    <Link href="/qna">
                        <Button>저장</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}