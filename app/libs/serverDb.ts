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
    article_id: number;
    comment: string;
    comment_user_id: string;
    comment_user_name: string;
    comment_user_image: string;
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
//TODO : userId 인자로 받아서 해당 게시물의 작성자 여부 정보도 추가 
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
        SELECT  A.COMMENT_ID, 
                A.ARTICLE_ID, 
                A.COMMENT,
                A.COMMENT_USER_ID,
                B.NAME AS COMMENT_USER_NAME,
                B.IMAGE AS COMMENT_USER_IMAGE,
                A.CREATED 
        FROM    COMMENTS A ,
                NEXT_AUTH.USERS B
        WHERE   A.ARTICLE_ID = ${articleId}
        AND     B.ID = A.COMMENT_USER_ID ; `;

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

