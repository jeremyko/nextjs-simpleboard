"use server";

//XXX client component 에서 server action 을 사용하려면 use server 를 선언해야 한다.
import { z } from "zod";
import postgres, { PostgresError } from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkIsAuthenticated, isAuthenticatedAndMine } from "@/app/libs/dataAccessLayer";
import { auth } from "@/auth";
import { fetchAllCommentReplyImgPaths, getTotalPagesCount } from "@/app/libs/serverDb";
import { getImgBucketName, getPostsPerPage } from "@/global_const/global_const";
import { deleteFilesAction, uploadFileAction } from "./actionImage";
import { extractImgSrcList, extractVideoSrcList, publicUrlToPath } from "@/app/libs/supabaseServer";
import { url } from "inspector";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
    //XXX 왜 배열 type 을 지정해야 하는가 ==> zod 에서 그렇게 리턴해준다..
    errors?: {
        categoryId?: string[]|null;
        title?: string[]|null;
        content?: string[]|null;
    };
    message?: string | null;
};

export type CommentState = {
    errors?: {
        content?: string[]|null;
    };
    message?: string | null;
    redirectTo?: string | null;
};

export type DelQnAState = {
    error?: string | null;
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
});

const UpdateFormSchema = z.object({
    // categoryId: z.string().trim().nonempty({ message: "분류를 선택하세요" }),
    categoryId: z.string(),
    title: z.string().trim().nonempty({ message: "공백은 불가합니다" }),
    content: z.string().trim().nonempty({ message: "공백은 불가합니다" }),
});

const CreateCommentFormSchema = z.object({
    content: z.string().trim().nonempty({ message: "내용을 입력하세요" }),
});

const CreateQnA = CreateFormSchema.omit({});
const UpdateQnA = UpdateFormSchema.omit({});
const CreateQnAComment = CreateCommentFormSchema.omit({});

const sanitizeImageUrls = (html: string) => {
    // blob URL과 Supabase URL만 허용
    return html.replace(/<img [^>]*src="([^"]+)"[^>]*>/gi, (_, src) => {
        if (src.startsWith("blob:") || src.includes("supabase.co/storage/v1/object/public/")) {
            return `<img src="${src}" />`;
        }
        return "";
    });
};

const sanitizeVideoUrls = (html: string) => {
    // blob URL과 Supabase URL만 허용
    return html.replace(/<video controls[^>]*src="([^"]+)"[^>]*>/gi, (_, src) => {
        if (src.startsWith("blob:") || src.includes("supabase.co/storage/v1/object/public/")) {
            return `<video controls src="${src}" />`;
        }
        return "";
    });
};
////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글 생성 서버 액션 
 * @param prevState - 이전 상태 객체(State)
 * @param formData - 폼 데이터(FormData)
 * @returns 생성 성공 시 리다이렉트, 실패 시 에러 메시지와 필드 에러 반환
 */
export async function createQuestion(prevState: State, formData: FormData) {
    //XXX 이 로그는 server 기동시킨 터미널에서만 보임. server 액션
    // console.debug("==> createQuestion called with formData:", formData);

    const validatedFields = CreateQnA.safeParse({
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
            message: prevState.message + "==> Missing Fields. Failed to Create QnA.",
        };
    }
    const { categoryId, title, content } = validatedFields.data;
    //const date = new Date().toISOString().split("T")[0];
    // console.debug("==> createQuestion :", categoryId, title, content);

    //html 이 저장되므로, 내용이 공백인지 확인하는 로직 추가
    const text = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 공백 확인
    // console.debug("text len=", text.length);
    if (text.length === 0) {
        return {
            errors: { categoryId: null, title: null, content: ["내용을 입력하세요"] },
        };
    }

    //userId
    const session = await auth();
    if (!session) {
        console.debug("[createQuestion] 로그인 안된 상태로 접근함");
        return {
            message: "로그인 후 다시 시도하세요.",
            errors: { categoryId: ["로그인 후 다시 시도하세요."] },
        };
    }
    const userId = session.userId;
    if (!userId) {
        console.debug("재 로그인 필요");
        return {
            message: "유저 정보가 올바르지 않습니다. 다시 로그인 해주세요.",
            errors: { categoryId: ["유저 정보가 없습니다."] },
        };
    }

    // key : blob url , value : File
    let replacedContent = content;
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            const publicUrl = await uploadFileAction(value as File);
            // URL.revokeObjectURL(key); // XXX 여기서 실행 하면 error : 아직 upload 안끝났는데 revoke 
            replacedContent = replacedContent.replaceAll(key, publicUrl); 
        }
    }
    let finalHtml = sanitizeImageUrls(replacedContent);
    finalHtml = sanitizeVideoUrls(finalHtml);
    // console.debug("content with public url:", replacedContent);
    // console.debug("finalHtml:", finalHtml);

    try {
        await sql`
            INSERT INTO articles (title, contents, user_id, category_id) 
            VALUES ( ${title}, ${finalHtml}, ${userId}, ${categoryId} )`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Create QnA.",
            // errors: error,
        };
    }

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            // console.log("Revoke URL:", key);
            URL.revokeObjectURL(key); 
        }
    }

    revalidatePath("/qna");
    redirect("/qna");
}

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글 수정 서버 액션 
 */
export async function updateQuestion(
    postUserId: string, // 게시글 작성자 ID
    articleId: number,
    currentPage: number,
    searchQuery: string,
    oriContent: string, // 수정되기 전의 content (이미지 삭제된것 파악하기 위해)
    prevState: State,
    formData: FormData,
) {
    // console.debug("edit action ==> updateQuestion formData:", formData);
    // console.debug("            ==> post userId :", postUserId);
    // console.debug("            ==> article_id :", articleId, " currentPage:", currentPage);
    // console.debug("            ==> searchQuery :", searchQuery);

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
    //html 이 저장되므로, 내용이 공백인지 확인하는 로직 추가
    const text = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 공백 확인
    // console.debug("text len=", text.length);
    if (text.length === 0) {
        return {
            errors: { categoryId: null, title: null, content: ["내용을 입력하세요"] },
        };
    }

    const isLoggedInAndMine = await isAuthenticatedAndMine(postUserId);
    if (!isLoggedInAndMine) {
        console.error("로그인 안된 상태 혹은 본인 게시물 아님");
        redirect("/api/auth/signin");
    }

    // key : blob url , value : File
    let replacedContent = content;
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            const publicUrl = await uploadFileAction(value as File);
            console.debug("Uploading file :", key, " to ", publicUrl);
            replacedContent = replacedContent.replaceAll(key, publicUrl);
        }
    }
    let finalHtml = sanitizeImageUrls(replacedContent);
    finalHtml = sanitizeVideoUrls(finalHtml);
    // console.debug("content with public url:", replacedContent);
    // console.debug("finalHtml:", finalHtml);
    const oriImgSrcList = extractImgSrcList(oriContent); // 수정되기 전의 이미지 URL(public) 목록
    const imgSrcList = extractImgSrcList(finalHtml);
    const oriVideoSrcList = extractVideoSrcList(oriContent); // 수정되기 전의 video URL(public) 목록
    const videoSrcList = extractVideoSrcList(finalHtml);
    // 최종 URL 목록과 비교해서 삭제된 files 파악.
    let deletedImgSrc = oriImgSrcList.filter((e) => !imgSrcList.includes(e));
    let deletedVideoSrc = oriVideoSrcList.filter((e) => !videoSrcList.includes(e));
    if (deletedImgSrc.length > 0) {
        // console.debug("updateQuestion : deletedImgSrc:", deletedImgSrc);
        const deletedImgPaths = deletedImgSrc.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        // console.debug("updateQuestion : imgSrcList:", imgSrcList);
        // console.debug("updateQuestion : deletedImgPaths:", deletedImgPaths);
        try {
            deleteFilesAction(deletedImgPaths);
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }
    if (deletedVideoSrc.length > 0) {
        const deletedVideoPaths = deletedVideoSrc.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        try {
            deleteFilesAction(deletedVideoPaths);
        } catch (error) {
            return {
                error: `video file 삭제 에러: ${error}`,
            };
        }
    }

    try {
        await sql` 
        UPDATE articles 
        SET    title= ${title}, contents=${finalHtml}, category_id= ${categoryId} 
        WHERE  article_id = ${articleId}
        AND    user_id = ${postUserId}`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to Update QnA.",
        };
    }

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            // console.log("Revoke URL:", key);
            URL.revokeObjectURL(key); 
        }
    }
    revalidatePath(`/qna/${articleId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
    redirect(`/qna/${articleId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`);
}

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글 삭제 서버 액션 .
 */
export async function deleteQuestion(
    articleId: number,
    currentPage: number,
    postUserId: string,
    searchQuery: string,
    content: string,
) {
    // 로그인된 상태에서만 처리되어야 함
    const isLoggedInAndMine = await isAuthenticatedAndMine(postUserId);
    if (!isLoggedInAndMine) {
        console.error("로그인 안된 상태 혹은 본인 게시물 아님");
        redirect("/api/auth/signin");
    }

    const imgSrcList = extractImgSrcList(content);
    if (imgSrcList.length > 0) {
        const delImgPaths = imgSrcList.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        // console.debug("deleteQuestion : imgSrcList:", imgSrcList);
        // console.debug("deleteQuestion : delImgPaths:", delImgPaths);
        try {
            deleteFilesAction(delImgPaths);
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }
    const videoSrcList = extractVideoSrcList(content);
    if (videoSrcList.length > 0) {
        const delVideoPaths = videoSrcList.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        // console.debug("videoSrcList : videoSrcList:", videoSrcList);
        // console.debug("deleteQuestion : delVideoPaths:", delVideoPaths);
        try {
            deleteFilesAction(delVideoPaths);
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }

    // 게시글이 삭제되면 모든 댓글도 삭제됨. 이때 댓글에 포함된 모든 이미지 삭제
    const urls = await fetchAllCommentReplyImgPaths(articleId);
    if (urls.length > 0) {
        try {
            deleteFilesAction(urls.map((u) => publicUrlToPath(u.url, getImgBucketName())));
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }

    // 게시글 삭제
    try {
        await sql`DELETE FROM articles WHERE article_id = ${articleId} and user_id = ${postUserId}`;
    } catch (error) {
        const sqlError = error as PostgresError;
        console.error("sqlError:", sqlError);
        // if (sqlError.code === "23503") {
        //     return {
        //         error: "대댓글이 있는 경우 삭제할수 없습니다",
        //     };
        // }
        return {
            error: `Database Error: ${sqlError.code} / ${sqlError.detail} `,
        };
    }

    const totalPagesCnt = await getTotalPagesCount(searchQuery, getPostsPerPage());
    if(totalPagesCnt < currentPage){
        if (currentPage ===1) {
            // console.debug("post 가 1 page 에만 있던 경우. 그냥 전체 목록으로 이동");
            revalidatePath(`/qna?query=${searchQuery}`);
            redirect(`/qna?query=${searchQuery}`);
        }else{
            // console.debug("마지막 게시물을 삭제하는 경우, page 를 -1 처리");
            revalidatePath(`/qna?query=${searchQuery}&page=${currentPage - 1}`);
            redirect(`/qna?query=${searchQuery}&page=${currentPage - 1}`);
        }
    }else{
        revalidatePath(`/qna?query=${searchQuery}&page=${currentPage}`);
        redirect(`/qna?query=${searchQuery}&page=${currentPage}`);
    }
}

//////////////////////////////////////////////////////////////////////////////// comment
/**
 * QnA 게시글 댓글 생성
 */
export async function createComment(
    userId: string, // 댓글 작성자 ID
    currentPostUserName: string,
    currentPage: number,
    searchQuery: string,
    currentPostId: number,
    prevState: CommentState,
    formData: FormData,
) {
    // console.debug("==> createComment called with formData:", formData);
    const isIsAuthenticated = await checkIsAuthenticated();
    if (!isIsAuthenticated) {
        // console.error("로그인 안된 상태 ");
        redirect("/api/auth/signin");
    }

    const validatedFields = CreateQnAComment.safeParse({
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        const pretty = z.prettifyError(validatedFields.error);
        console.error("Validation error details:", pretty);
        const flattened = z.flattenError(validatedFields.error);
        console.error("Flattened error details:", flattened);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: prevState.message + "==> Missing Fields. Failed to Create Comment.",
        };
    }
    const { content } = validatedFields.data;
    //html 이 저장되므로, 내용이 공백인지 확인하는 로직 추가
    const text = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 공백 확인
    // console.debug("text len=", text.length);
    if (text.length === 0) {
        return {
            errors: { content: ["내용을 입력하세요"] },
        };
    }

    // key : blob url , value : File
    let replacedContent = content;
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            const publicUrl = await uploadFileAction(value as File);
            // URL.revokeObjectURL(key); // XXX 여기서 실행 하면 error : 아직 uploadImageAction 안끝났는데 revoke 
            replacedContent = replacedContent.replaceAll(key, publicUrl); 
        }
    }
    let finalHtml = sanitizeImageUrls(replacedContent);
    finalHtml = sanitizeVideoUrls(finalHtml);

    try {
        await sql` 
        INSERT INTO comments (article_id, comment, comment_user_id,reply_to) 
        VALUES ( ${currentPostId}, ${finalHtml}, ${userId}, ${currentPostUserName} )`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to create QnA comment.",
        };
    }

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            // console.log("Revoke URL:", key);
            URL.revokeObjectURL(key); 
        }
    }

    return {
        redirectTo: `/qna/${currentPostId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`,
    };
}

////////////////////////////////////////////////////////////////////////////////
/**
 * QnA 게시글 댓글 update
 */
export async function updateComment(
    userId: string, // 댓글 작성자 ID
    currentPage: number,
    searchQuery: string,
    currentPostId: number,
    currentCommentId: number,
    oriComment: string, // 수정되기 전의 comment (이미지 삭제된것 파악하기 위해)
    prevState: CommentState,
    formData: FormData,
) {
    // console.debug("updateComment formData:", formData);
    const isIsAuthenticated = await checkIsAuthenticated();
    if (!isIsAuthenticated) {
        redirect("/api/auth/signin");
    }

    const validatedFields = CreateQnAComment.safeParse({
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        const pretty = z.prettifyError(validatedFields.error);
        console.error("Validation error details:", pretty);
        const flattened = z.flattenError(validatedFields.error);
        console.error("Flattened error details:", flattened);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: prevState.message + "==> Missing Fields. Failed to update Comment.",
        };
    }
    const { content } = validatedFields.data;
    //html 이 저장되므로, 내용이 공백인지 확인하는 로직 추가
    const text = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 공백 확인
    // console.debug("text len=", text.length);
    if (text.length === 0) {
        return {
            errors: { content: ["내용을 입력하세요"] },
        };
    }

    // key : blob url , value : File
    let replacedContent = content;
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            const publicUrl = await uploadFileAction(value as File);
            // console.debug("Uploading file :", key, " to ", publicUrl);
            replacedContent = replacedContent.replaceAll(key, publicUrl);
        }
    }
    let finalHtml = sanitizeImageUrls(replacedContent);
    finalHtml = sanitizeVideoUrls(finalHtml);
    // console.debug("content with public url:", replacedContent);
    // console.debug("finalHtml:", finalHtml);
    const oriImgSrcList = extractImgSrcList(oriComment); // 수정되기 전의 이미지 URL(public) 목록
    const imgSrcList = extractImgSrcList(finalHtml);
    const oriVideoSrcList = extractVideoSrcList(oriComment); // 수정되기 전의 video URL(public) 목록
    const videoSrcList = extractVideoSrcList(finalHtml);
    // 최종 이미지 URL 목록과 비교해서 삭제된 이미지 파악.
    let deletedImgSrc = oriImgSrcList.filter((e) => !imgSrcList.includes(e));
    let deletedVideoSrc = oriVideoSrcList.filter((e) => !videoSrcList.includes(e));
    if (deletedImgSrc.length > 0) {
        // console.debug("updateComment: deletedImgSrc:", deletedImgSrc);
        const deletedImgPaths = deletedImgSrc.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        // console.debug("updateComment: imgSrcList:", imgSrcList);
        // console.debug("updateComment : deletedImgPaths:", deletedImgPaths);
        try {
            deleteFilesAction(deletedImgPaths);
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }
    if (deletedVideoSrc.length > 0) {
        const deletedVideoPaths = deletedVideoSrc.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        try {
            deleteFilesAction(deletedVideoPaths);
        } catch (error) {
            return {
                error: `video file 삭제 에러: ${error}`,
            };
        }
    }

    try {
        await sql` 
        UPDATE comments 
        SET COMMENT = ${finalHtml}
        WHERE comment_id= ${currentCommentId} 
        AND comment_user_id=${userId}`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to update QnA comment.",
        };
    }

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            // console.log("Revoke URL:", key);
            URL.revokeObjectURL(key); 
        }
    }

    return {
        redirectTo: `/qna/${currentPostId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`,
    };
}

////////////////////////////////////////////////////////////////////////////////
/**
 * comment 삭제
 */
export async function deleteComment(
    commentUserId: string, // 댓글 작성자 ID
    currentPage: number,
    searchQuery: string,
    currentPostId: number,
    commentId: number,
    comment: string,
) {
    const isLoggedInAndMine = await isAuthenticatedAndMine(commentUserId);
    if (!isLoggedInAndMine) {
        console.error("본인 댓글 아님");
        redirect("/api/auth/signin");
    }

    const imgSrcList = extractImgSrcList(comment);
    if (imgSrcList.length > 0) {
        const delImgPaths = imgSrcList.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        // console.debug("deleteComment : imgSrcList:", imgSrcList);
        // console.debug("deleteComment : delImgPaths:", delImgPaths);
        try {
            deleteFilesAction(delImgPaths);
        } catch (error) {
            return {
                error: `image file 삭제 에러: ${error}`,
            };
        }
    }

    const videoSrcList = extractVideoSrcList(comment);
    if (videoSrcList.length > 0) {
        const delVideoPaths = videoSrcList.map((url: string) => publicUrlToPath(url, getImgBucketName()));
        try {
            deleteFilesAction(delVideoPaths);
        } catch (error) {
            return {
                error: `video file 삭제 에러: ${error}`,
            };
        }
    }

    try {
        // 대 댓글이 달려있는 댓글을 삭제 시
        // table 에 데이터는 유지하되, 내용만 삭제로 변경하게 처리. TODO 개선
        // await sql`DELETE FROM comments WHERE comment_id = ${commentId} and comment_user_id=${commentUserId}`;
        await sql`UPDATE comments SET comment='작성자에 의해 삭제된 댓글입니다.' WHERE comment_id = ${commentId} and comment_user_id=${commentUserId}`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to delete QnA comment.",
        };
    }
    return {
        redirectTo: `/qna/${currentPostId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`,
    };
}

//////////////////////////////////////////////////////////////////////////////// comment
/**
 * QnA 게시글 대댓글 생성
 */
export async function createReply(
    currUserId: string, // 댓글 작성자 ID
    // commentUserId: string, // 응답할 댓글의 작성자
    commentId: number, //응답할 comment id
    commentUserName: string,
    currentPage: number,
    searchQuery: string,
    currentPostId: number,
    prevState: CommentState,
    formData: FormData,
) {
    // console.debug("==> createReply called with formData:", formData);
    const isIsAuthenticated = await checkIsAuthenticated();
    if (!isIsAuthenticated) {
        // console.error("로그인 안된 상태 ");
        redirect("/api/auth/signin");
    }

    const validatedFields = CreateQnAComment.safeParse({
        content: formData.get("content"),
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        const pretty = z.prettifyError(validatedFields.error);
        console.error("Validation error details:", pretty);
        const flattened = z.flattenError(validatedFields.error);
        console.error("Flattened error details:", flattened);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: prevState.message + "==> Missing Fields. Failed to Create Comment.",
        };
    }
    const { content } = validatedFields.data;
    //html 이 저장되므로, 내용이 공백인지 확인하는 로직 추가
    const text = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 공백 확인
    // console.debug("text len=", text.length);
    if (text.length === 0) {
        return {
            errors: { content: ["내용을 입력하세요"] },
        };
    }

    // key : blob url , value : File
    let replacedContent = content;
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            const publicUrl = await uploadFileAction(value as File);
            replacedContent = replacedContent.replaceAll(key, publicUrl); 
        }
    }
    let finalHtml = sanitizeImageUrls(replacedContent);
    finalHtml = sanitizeVideoUrls(finalHtml);

    // console.debug("p_comment_id :", commentId);
    try {
        await sql` 
        INSERT INTO comments (article_id, p_comment_id, comment, comment_user_id,reply_to) 
        VALUES ( ${currentPostId},  ${commentId}, ${finalHtml}, ${currUserId},${commentUserName} )`;
    } catch (error) {
        console.error(error);
        return {
            message: "Database Error: Failed to create QnA reply.",
        };
    }

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("blob:http")) {
            // console.log("Revoke URL:", key);
            URL.revokeObjectURL(key); 
        }
    }

    return {
        redirectTo: `/qna/${currentPostId}?page=${currentPage}&query=${encodeURIComponent(searchQuery)}`,
    };
}
