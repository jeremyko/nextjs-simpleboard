import postgres from "postgres";
// import {
//     CustomerField,
//     CustomersTableType,
//     InvoiceForm,
//     InvoicesTable,
//     LatestInvoiceRaw,
//     Revenue,
// } from './definitions';
// import { formatCurrency } from './utils';

const ITEMS_PER_PAGE = 5; //TODO
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type BoardItems = {
    article_id: number;
    title: string;
    created: string;
    category_name: string;
    views: number;
};

export async function fetchPagedBoardItems(currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const boardItems = await sql<BoardItems[]>`
        select  A.article_id, A.title, to_char(A.created, 'YYYY-MM-DD') as created, 
                B.name as category_name, A.views 
        from articles A ,
            categories B
        where B.caterory_id = A.caterory_id 
        order by A.created desc 
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset} `;

        return boardItems;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch board items.");
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
