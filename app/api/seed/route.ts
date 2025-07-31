import bcrypt from 'bcrypt';
import postgres from 'postgres';
// import { use } from 'react';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

////////////////////////////////////////////////////////////////////////////////
const users = [
    {
        name: 'kojh',
        email: 'test@test.com',
        password: '123456',
    },
];

export async function GET() {
    try {
        const result = await sql.begin((sql) => [
            seedUsers(),
            seedCategories(),
            seedArticles(),
            seedComments(),
        ]);

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

async function seedUsers() {
    await sql`DROP TABLE IF EXISTS public.users CASCADE`;

    await sql`
    CREATE TABLE IF NOT EXISTS public.users (
        user_id serial not null,
        name text not null,
        email text not null,
        password text not null,
        created timestamp with time zone not null default now(),
        constraint users_pkey primary key (user_id)
    ); `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ; `; }),
    );
    return insertedUsers;
}

////////////////////////////////////////////////////////////////////////////////
const articles = [
    {
        title: 'test title 1',
        contents: 'test contents 1',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 2',
        contents: 'test contents 2',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 3',
        contents: 'test contents 3',
        views: 1,
        user_id: 1,
        caterory_id: 2,
    },
    {
        title: 'test title 4',
        contents: 'test contents 4',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 5',
        contents: 'test contents 5',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 6',
        contents: 'test contents 6',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 7',
        contents: 'test contents 7',
        views: 1,
        user_id: 1,
        caterory_id: 2,
    },
    {
        title: 'test title 8',
        contents: 'test contents 8',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 9',
        contents: 'test contents 9',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    },
    {
        title: 'test title 10',
        contents: 'test contents 10',
        views: 1,
        user_id: 1,
        caterory_id: 1,
    }
];

async function seedArticles() {
    await sql`DROP TABLE IF EXISTS public.articles CASCADE`;

    await sql`
    CREATE TABLE IF NOT EXISTS public.articles (
        article_id serial not null,
        title character varying(100) not null,
        contents text not null,
        created timestamp with time zone not null default now(),
        user_id serial not null,
        caterory_id serial not null,
        views integer not null default 0,
        constraint articles_pkey primary key (article_id)
    ); `;

    const insertedArticles = await Promise.all(
        articles.map(
            (article) => sql` INSERT INTO articles(title, contents, views, user_id, caterory_id)
        VALUES (${article.title}, ${article.contents}, ${article.views}, ${article.user_id}, ${article.caterory_id});`));
    return insertedArticles;
}
////////////////////////////////////////////////////////////////////////////////
const comments = [
    {
        article_id: 1,
        comment: '111111',
        comment_user_id: 1
    },
    {
        article_id: 1,
        comment: '2222',
        comment_user_id: 1
    }
];

async function seedComments() {
    await sql`DROP TABLE IF EXISTS public.comments CASCADE`;

    await sql`
    create table if not exists public.comments (
        comment_id serial not null,
        article_id serial not null,
        comment text not null,
        comment_user_id serial not null,
        constraint comments_pkey primary key (comment_id)
    ) ; `;

    const insertedComments = await Promise.all(
        comments.map(
            (comment) => sql`
        INSERT INTO comments (article_id, comment, comment_user_id)
        VALUES (${comment.article_id}, ${comment.comment}, ${comment.comment_user_id} ); `)
    );

    return insertedComments;
}
////////////////////////////////////////////////////////////////////////////////
const categories = [
    {
        name: 'Q&A',
    },
    {
        name: '자유',
    },
];
async function seedCategories() {
    await sql`DROP TABLE IF EXISTS public.categories CASCADE`;

    await sql`
    create table public.categories (
        caterory_id serial not null,
        name character varying(100) not null,
        constraint categories_pkey primary key (caterory_id)
    ) ; `;

    const insertedCategories = await Promise.all(
        categories.map(
            (invoice) => sql`
        INSERT INTO categories (name)
        VALUES (${invoice.name}); `)
    );

    return insertedCategories;
}
