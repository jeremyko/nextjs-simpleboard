"use server";

//XXX client component 에서 server action 을 사용하려면 use server 를 선언해야 한다.
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticatedAndMine } from "@/app/libs/dataAccessLayer";
import { auth } from "@/auth";
import { is } from "zod/v4/locales";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
    //XXX 왜 배열 type 을 지정해야 하는가 ==> zod 에서 그렇게 리턴해준다..
    errors?: {
        categoryId?: string[];
        title?: string[];
        content?: string[];
        // userId?: string[]; //TODO
    };
    message?: string | null;
};

//XXX 위 State 와 아래 Schema 의 필드들은 일치해야 함
//    왜냐하면, createQuestion 함수에서 State를 검증할 때,
//    CreateQnA.safeParse() 를 사용하기 때문
//    따라서, State의 필드가 Schema에 정의되어 있지 않으면, 검증에 실패하게 된다
// XXX 일치하지 않으면 useActionState 에서 에러 발생됨

const CreateFormSchema = z.object({
    categoryId: z.string().trim().nonempty({ message: "분류를 선택하세요" }),
    title: z.string().trim().nonempty({ message: "제목을 입력하세요" }),
    content: z.string().trim().nonempty({ message: "내용을 입력하세요" }),
    date: z.string().trim().nonempty().optional(),
    // views: z.number(),
    // userId: z.string(), //TODO
});

const UpdateFormSchema = z.object({
    // categoryId: z.string().trim().nonempty({ message: "분류를 선택하세요" }),
    categoryId: z.string(),
    title: z.string().trim().nonempty({ message: "공백은 불가합니다" }),
    content: z.string().trim().nonempty({ message: "공백은 불가합니다" }),
});

const CreateQnA = CreateFormSchema.omit({ date: true });
const UpdateQnA = UpdateFormSchema.omit({});
// const UpdateQnA = UpdateFormSchema;

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글을 생성하는 서버 액션 함수입니다.
 * @param prevState - 이전 상태 객체(State)
 * @param formData - 폼 데이터(FormData)
 * @returns 생성 성공 시 리다이렉트, 실패 시 에러 메시지와 필드 에러 반환
 */
export async function createQuestion(prevState: State, formData: FormData) {
    //XXX 이 로그는 server 기동시킨 터미널에서만 보임. 왜냐하면 server 액션이기 때문
    console.log("==> createQuestion called with formData:", formData);

    const validatedFields = CreateQnA.safeParse({
        categoryId: formData.get("categoryId"),
        title: formData.get("title"),
        content: formData.get("content"),
        // userId: formData.get("userId"), //TODO
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        const pretty = z.prettifyError(validatedFields.error);
        console.error("Validation error details:", pretty);

        const flattened = z.flattenError(validatedFields.error);
        console.error("Flattened error details:", flattened);

        return {
            // The fieldErrors object provides an array of errors for each field in the schema.
            // https://zod.dev/error-formatting?id=zflattenerror
            errors: validatedFields.error.flatten().fieldErrors,
            // errors: z.treeifyError(validatedFields.error).errors,
            message: prevState.message + "==> Missing Fields. Failed to Create QnA.",
        };
    }
    const { categoryId, title, content } = validatedFields.data;
    //const date = new Date().toISOString().split("T")[0];
    console.log("==> createQuestion :", categoryId, title, content);

    //userId 
    const session = await auth();
    if (!session) {
        console.log("[createQuestion] 로그인 안된 상태로 접근함");
        return {
            message: "로그인 후 다시 시도하세요.",
            errors: { categoryId: ["로그인 후 다시 시도하세요."] },
        };
    }
    console.log("==> createQuestion session:", session);
    const userId = session.userId;
    console.log("==> createQuestion userId:", userId);
    if (!userId) {
        console.log("재 로그인 필요");
        return {
            message: "유저 정보가 올바르지 않습니다. 다시 로그인 해주세요.",
            errors: { categoryId: ["유저 정보가 없습니다."] },
        };
    }
    try {
        await sql`
            INSERT INTO articles (title, contents, user_id, category_id) 
            VALUES ( ${title}, ${content}, ${userId}, ${categoryId} )`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Create QnA.",
            // errors: error,
        };
    }

    revalidatePath("/qna");
    redirect("/qna");
}

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글을 수정하는 서버 액션 함수입니다.
 * @param articleId - 수정할 게시글의 ID
 * @param currentPage - 현재 페이지 번호
 * @param searchQuery - 현재 검색어
 * @param prevState - 이전 상태 객체(State)
 * @param formData - 폼 데이터(FormData)
 * @returns 수정 성공 시 리다이렉트, 실패 시 에러 메시지와 필드 에러 반환
 */
export async function updateQuestion(
    postUserId: string, // 게시글 작성자 ID
    articleId: number,
    currentPage: number,
    searchQuery: string,
    prevState: State,
    formData: FormData,
) {
    //XXX 인자를 받기 위해서는 호출시 bind 을 사용해야 한다.
    // const updateQnaWithArticleId = updateQuestion.bind(null, oneQnA.article_id, currentPage);

    // 이 로그는 server 기동시킨 터미널에서만 보임. 왜냐하면 server 액션이기 때문
    console.log("edit action ==> updateQuestion formData:", formData);
    console.log("            ==> post userId :",postUserId );
    console.log("            ==> article_id :", articleId, " currentPage:", currentPage);
    console.log("            ==> searchQuery :", searchQuery);

    const validatedFields = UpdateQnA.safeParse({
        categoryId: formData.get("categoryId"),
        title: formData.get("title"),
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        const pretty = z.prettifyError(validatedFields.error);
        console.error("Validation error details:", pretty);
        const flattened = z.flattenError(validatedFields.error);
        console.error("Flattened error details:", flattened);

        return {
            // The fieldErrors object provides an array of errors for each field in the schema.
            // https://zod.dev/error-formatting?id=zflattenerror
            errors: validatedFields.error.flatten().fieldErrors,
            // errors: z.treeifyError(validatedFields.error).errors,
            message: prevState.message + "==> Missing Fields. Failed to Update QnA.",
        };
    }
    const { categoryId, title, content } = validatedFields.data;

    const isLoggedInAndMine = await isAuthenticatedAndMine(postUserId );
    if (!isLoggedInAndMine) {
        console.error("로그인 안된 상태 혹은 본인 게시물 아님");
        return {
            message: "로그인 후 다시 시도하세요. 본인의 게시물만 수정할 수 있습니다",
        };
    }

    try {
        await sql` 
        UPDATE articles 
        SET    title= ${title}, contents=${content}, category_id= ${categoryId} 
        WHERE  article_id = ${articleId}
        AND    user_id = ${postUserId}`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Update QnA.",
        };
    }
    revalidatePath(`/qna/${articleId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
    redirect(`/qna/${articleId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
}

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글을 삭제하는 서버 액션 함수입니다.
 * @param articleId - 삭제할 게시글의 ID
 * @param currentPage - 현재 페이지 번호
 * @returns 삭제 후 해당 페이지로 리다이렉트
 */
export async function deleteQuestion(articleId: number, currentPage: number, postUserId: string) {
    // 로그인된 상태에서만 처리되어야 함
    const isLoggedInAndMine = await isAuthenticatedAndMine(postUserId );
    if (!isLoggedInAndMine) {
        console.error("로그인 안된 상태 혹은 본인 게시물 아님");
    }

    //TODO : 마지막 게시물을 삭제하는 경우, page parameter 를 -1 한것으로 해줘야 함
    await sql`DELETE FROM articles WHERE article_id = ${articleId} and user_id = ${postUserId}`;
    revalidatePath(`/qna?page=${currentPage}`);
    redirect(`/qna?page=${currentPage}`);
}
