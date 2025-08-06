import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type BoardItems = {
    rownum: number;
    article_id: number;
    title: string;
    created: string;
    category_id: number;
    category_name: string;
    comment_count: number;
    views: number;
};
export type BoardItemById = {
    article_id: number;
    title: string;
    contents: string;
    created: string;
    category_id: number;
    category_name: string;
    comment_count: number;
    views: number;
};

export type CategoryItem = {
    category_id: number;
    name: string;
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
                A.TITLE, 
                TO_CHAR(A.CREATED, 'YYYY-MM-DD') AS CREATED, 
                B.CATEGORY_ID , 
                B.NAME AS CATEGORY_NAME, 
                COUNT(C.COMMENT_ID) AS COMMENT_COUNT, 
                A.VIEWS
        FROM    ARTICLES A 
                INNER JOIN CATEGORIES B ON B.CATEGORY_ID = A.CATEGORY_ID 
                LEFT OUTER JOIN COMMENTS C ON C.ARTICLE_ID = A.ARTICLE_ID     
        WHERE  (A.TITLE ILIKE '%' || ${searchQuery} || '%' OR     
                A.CONTENTS ILIKE '%' || ${searchQuery} || '%')
        GROUP BY A.ARTICLE_ID, A.TITLE, A.CREATED,B.CATEGORY_ID, B.NAME, A.VIEWS
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
                A.TITLE, 
                A.CONTENTS,
                TO_CHAR(A.CREATED, 'YYYY-MM-DD') AS CREATED, 
                B.CATEGORY_ID , 
                B.NAME AS CATEGORY_NAME, 
                COUNT(C.COMMENT_ID) AS COMMENT_COUNT, 
                A.VIEWS
        FROM    ARTICLES A 
                INNER JOIN CATEGORIES B ON B.CATEGORY_ID = A.CATEGORY_ID 
                LEFT OUTER JOIN COMMENTS C ON C.ARTICLE_ID = A.ARTICLE_ID     
        GROUP BY A.ARTICLE_ID, A.TITLE, A.CREATED, B.CATEGORY_ID, B.NAME, A.VIEWS
        having A.article_id = ${id}; `;

        return data[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch QnA.");
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

// export async function fetchCardData() {
//     try {
//         // You can probably combine these into a single SQL query
//         // However, we are intentionally splitting them to demonstrate
//         // how to initialize multiple queries in parallel with JS.
//         const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//         const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//         const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//         const data = await Promise.all([
//             invoiceCountPromise,
//             customerCountPromise,
//             invoiceStatusPromise,
//         ]);

//         const numberOfInvoices = Number(data[0][0].count ?? '0');
//         const numberOfCustomers = Number(data[1][0].count ?? '0');
//         const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
//         const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

//         return {
//             numberOfCustomers,
//             numberOfInvoices,
//             totalPaidInvoices,
//             totalPendingInvoices,
//         };
//     } catch (error) {
//         console.error('Database Error:', error);
//         throw new Error('Failed to fetch card data.');
//     }
// }
