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

//XXX 위 State 와 아래 Schema 의 필드들은 일치해야 함
//    왜냐하면, createQuestion 함수에서 State를 검증할 때, 
//    CreateQnA.safeParse() 를 사용하기 때문
//    따라서, State의 필드가 Schema에 정의되어 있지 않으면, 검증에 실패하게 된다
// XXX 일치하지 않으면 useActionState 에서 에러 발생됨 

const FormSchema = z.object({
    categoryId: z.string(),
    title: z.string(),
    content: z.string(),
    // userId: z.string(), //TODO
    date: z.string(),
    // views: z.number(),
});

// const CreateQnA = FormSchema.omit({ date: true });
const CreateQnA = FormSchema.omit({ date: true, userId: true }); //TODO 

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
        await sql` INSERT INTO articles (title, contents, user_id, category_id) VALUES ( ${title}, ${content}, 999, ${categoryId} )`;
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