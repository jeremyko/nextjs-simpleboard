'use server'

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { use } from "react";

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

// export type UpdateState = {
//     errors?: {
//         categoryId?: string[]; 
//         title?: string[];
//         content?: string[];
//         // userId?: string[]; //TODO
//     };
//     message?: string | null;
// };
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

    try {
        await sql`
            INSERT INTO articles (title, contents, user_id, category_id) 
            VALUES ( ${title}, ${content}, 999, ${categoryId} )`;
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

export async function updateQuestion(articleId: number, currentPage:number, prevState: State, formData: FormData) {
    //XXX 인자를 받기 위해서는 호출시 bind 을 사용해야 한다.
    // const updateQnaWithArticleId = updateQuestion.bind(null, oneQnA.article_id, currentPage);

    // 이 로그는 server 기동시킨 터미널에서만 보임. 왜냐하면 server 액션이기 때문
    console.log("edit action ==> updateQuestion formData:", formData);
    console.log("            ==> article_id :", articleId, " currentPage:", currentPage);

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

    try {
        await sql` 
        UPDATE articles 
        SET    title= ${title}, contents=${content}, category_id= ${categoryId} 
        WHERE  article_id = ${articleId}`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Update QnA.",
        };
    }
    revalidatePath(`/qna/${articleId}?page=${currentPage}`);
    redirect(`/qna/${articleId}?page=${currentPage}`);
}