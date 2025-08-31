import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type BoardItems = {
    rownum: number;
    article_id: number;
    user_id: string;
    user_name: string;
    title: string;
    created: string;
    category_id: number;
    category_name: string;
    comment_count: number;
    views: number;
    user_image: string | null; // 사용자 이미지
};
export type BoardItemById = {
    article_id: number;
    user_id: string;
    user_name: string;
    title: string;
    contents: string;
    created: string;
    category_id: number;
    category_name: string;
    comment_count: number;
    views: number;
    user_image: string | null; // 사용자 이미지
    // isMine: boolean; // 게시물이 내가 작성한건지 여부
};

export type CategoryItem = {
    category_id: number;
    name: string;
};

export type OneComment = {
    comment_id: number;
    p_comment_id: number;
    article_id: number;
    comment: string;
    comment_user_id: string;
    comment_user_name: string;
    comment_user_image: string;
    reply_to: string;
    depth: number;
    path: string;
    // created:
};

export async function getTotalPagesCount(searchQuery: string, postPerPage: number): Promise<number> {
    try {
        const result = await sql<{ count: number }[]>`
            SELECT COUNT(*) AS count FROM ARTICLES A 
            WHERE (A.TITLE ILIKE '%' || ${searchQuery} || '%' OR 
                A.CONTENTS ILIKE '%' || ${searchQuery} || '%');
        `;
        const totalPages = Math.ceil(result[0].count / postPerPage);
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total pages count.");
    }
}

export async function getAllPostsCount(searchQuery: string): Promise<number> {
    try {
        const result = await sql<{ count: number }[]>`
            SELECT COUNT(*) AS count FROM ARTICLES A
            WHERE (A.TITLE ILIKE '%' || ${searchQuery} || '%' OR 
                A.CONTENTS ILIKE '%' || ${searchQuery} || '%');
        `;
        return result[0].count;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch posts count.");
    }
}

export async function fetchPagedBoardItems(
    currentPage: number,
    itemsPerPage: number,
    searchQuery: string,
): Promise<BoardItems[]> {
    const offset = (currentPage - 1) * itemsPerPage;

    try {
        const boardItems = await sql<BoardItems[]>`
        SELECT  (row_number() over(ORDER BY a.article_id )) as rownum,
                A.ARTICLE_ID, 
                A.USER_ID, 
                X.NAME AS USER_NAME,
                A.TITLE, 
                TO_CHAR(A.CREATED, 'YYYY-MM-DD') AS CREATED, 
                B.CATEGORY_ID , 
                B.NAME AS CATEGORY_NAME, 
                COUNT(C.COMMENT_ID) AS COMMENT_COUNT, 
                A.VIEWS,
                X.image AS USER_IMAGE
        FROM    ARTICLES A 
                INNER JOIN CATEGORIES B ON B.CATEGORY_ID = A.CATEGORY_ID 
                INNER join next_auth.users X on X.id = A.user_id
                LEFT OUTER JOIN COMMENTS C ON C.ARTICLE_ID = A.ARTICLE_ID     
        WHERE  (A.TITLE ILIKE '%' || ${searchQuery} || '%' OR     
                A.CONTENTS ILIKE '%' || ${searchQuery} || '%')
        GROUP BY A.ARTICLE_ID, A.TITLE, A.CREATED,B.CATEGORY_ID, B.NAME, A.VIEWS,X.image,X.name
        ORDER BY A.ARTICLE_ID DESC 
        LIMIT ${itemsPerPage} OFFSET ${offset} `;

        return boardItems;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch board items.");
    }
}

export async function fetchOneQnaById(id: number): Promise<BoardItemById> {
    try {
        const data = await sql<BoardItemById[]>`
        SELECT  A.ARTICLE_ID, 
                A.USER_ID, 
                X.NAME AS USER_NAME,
                A.TITLE, 
                A.CONTENTS,
                TO_CHAR(A.CREATED, 'YYYY-MM-DD') AS CREATED, 
                B.CATEGORY_ID , 
                B.NAME AS CATEGORY_NAME, 
                COUNT(C.COMMENT_ID) AS COMMENT_COUNT, 
                A.VIEWS,
                X.image AS USER_IMAGE
        FROM    ARTICLES A 
                INNER JOIN CATEGORIES B ON B.CATEGORY_ID = A.CATEGORY_ID 
                INNER join next_auth.users X on X.id = A.user_id
                LEFT OUTER JOIN COMMENTS C ON C.ARTICLE_ID = A.ARTICLE_ID     
        GROUP BY A.ARTICLE_ID, A.TITLE, A.CREATED, B.CATEGORY_ID, B.NAME, A.VIEWS, X.image,X.name
        having A.article_id = ${id}; `;

        return data[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch QnA.");
    }
}

export async function getComments(articleId: number): Promise<OneComment[]> {
    try {
        const data = await sql<OneComment[]>`

        WITH RECURSIVE COMMENT_TREE AS (
            SELECT  A.COMMENT_ID, 
                    A.ARTICLE_ID, 
                    A.P_COMMENT_ID, 
                    A.COMMENT_USER_ID, 
                    A.COMMENT,
                    B.NAME  AS COMMENT_USER_NAME,
                    B.IMAGE AS COMMENT_USER_IMAGE,
                    A.REPLY_TO,
                    A.CREATED,
                    1 AS DEPTH,
                    CAST(COMMENT_ID AS TEXT) AS PATH
            FROM    COMMENTS        A,
                    NEXT_AUTH.USERS B
            WHERE   A.ARTICLE_ID = ${articleId} 
            AND     A.P_COMMENT_ID IS null
            AND     B.ID = A.COMMENT_USER_ID 
            UNION ALL
            SELECT  C.COMMENT_ID, 
                    C.ARTICLE_ID, 
                    C.P_COMMENT_ID, 
                    C.COMMENT_USER_ID, 
                    C.COMMENT,
                    D.NAME  AS COMMENT_USER_NAME,
                    D.IMAGE AS COMMENT_USER_IMAGE,
                    C.REPLY_TO,
                    C.CREATED,
                    CT.DEPTH + 1,
                    CT.PATH || '>' || C.COMMENT_ID
            FROM    COMMENTS        C ,
                    COMMENT_TREE    CT,
                    NEXT_AUTH.USERS D
            WHERE   C.P_COMMENT_ID = CT.COMMENT_ID
            AND     D.ID = C.COMMENT_USER_ID
        )
        SELECT * FROM COMMENT_TREE
        ORDER BY PATH; `;

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch QnA comments.");
    }
}

export async function fetchCategoryData(): Promise<CategoryItem[]> {
    try {
        const data = await sql<CategoryItem[]>`
        SELECT  A.CATEGORY_ID, 
                A.NAME 
        FROM    CATEGORIES A `;

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch Categoryes.");
    }
}

export async function insertPostViews(articleId: number, currUserId: string, viewerIdForCnt: string) {
    // console.debug("insertPostViews : ",  viewerIdForCnt);
    try {
        await sql`
        WITH ins AS (
            INSERT INTO post_views (article_id, user_id, session_id) 
            VALUES ( ${articleId}, ${currUserId}, ${viewerIdForCnt} )
            ON CONFLICT DO NOTHING
            RETURNING 1
        )
        UPDATE articles
        SET views = views + 1
        WHERE article_id = ${articleId} AND EXISTS (SELECT 1 FROM ins)`;
    } catch (error) {
        console.error(error);
    }
}