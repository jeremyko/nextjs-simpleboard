import { fetchOneQnaById } from "@/app/libs/api";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;    

    console.log("QnA ID:", id);
    const oneQnA = await fetchOneQnaById(id);
    console.log("qna data:", oneQnA);

    if (!oneQnA) {
        notFound();
    }

    return (
        <div className="min-h-screen max-w-3xl mx-auto ">
            <div className="flex flex-col text-sm  font-medium p-4 mb-4 text-left ">
                <div className="rounded-md p-4 md:p-6">
                    {/* --------------------- */}
                    <div className="flex flex-row border-t border-b border-gray-600 ">
                        <label className="mt-2 mb-2 block font-light bg-gray-500 text-white pr-2 pl-2 rounded-sm ">
                            {oneQnA.category_name}
                        </label>
                        <label className="mt-2 ml-4 mb-2 block font-bold">{oneQnA.title}</label>
                    </div>
                    <div className="pt-2 pb-2 border-b border-gray-600 ">{oneQnA.contents}</div>

                    {/* --------------------- */}
                    <div className="mt-6 pt-2 pb-2 flex justify-between item-center gap-4">
                        {/* <Link href="/qna" >
                            <Button> 취소</Button>
                        </Link>


                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-blue-700 text-gray-300 text-sm font-medium  rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {" "}
                            저장
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}