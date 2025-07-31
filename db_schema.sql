
-- ///////////////////////////////////////////////////////////////////////////////

drop table public.articles CASCADE ;
drop table public.comments CASCADE ;
drop table public.users CASCADE ;
drop table public.categories CASCADE ;

create table public.categories (
  caterory_id serial not null,
  name character varying(100) not null,
  
  constraint categories_pkey primary key (caterory_id)
) TABLESPACE pg_default;

create table public.users (
  user_id serial not null,
  name text not null,
  email text not null,
  password text not null,
  created timestamp with time zone not null default now(),
  
  constraint users_pkey primary key (user_id)
) TABLESPACE pg_default;

create table public.articles (
  article_id serial not null,
  title character varying(100) not null,
  contents text not null,
  views integer null default 0,  
  created timestamp with time zone not null default now(),
  user_id serial not null,
  caterory_id serial not null,
  
  constraint articles_pkey primary key (article_id),
  constraint fk_categories_to_articles foreign KEY (caterory_id) references categories (caterory_id),
  constraint fk_users_to_articles foreign KEY (user_id) references users (user_id)
) TABLESPACE pg_default;

create table public.comments (
  comment_id serial not null,
  article_id serial not null,
  comment text not null,
  comment_user_id serial not null,  
  
  constraint comments_pkey primary key (comment_id),
  constraint fk_articles_to_comments foreign KEY (article_id) references articles (article_id)
  constraint fk_users_to_comments foreign KEY (user_id) references users (user_id)
) TABLESPACE pg_default;

-- ///////////////////////////////////////////////////////////////////////////////

select A.*, C.*, B.comment, B.comment_user_id 
from articles A,
     comments B, 
     users    C
where B.article_id = A.article_id
and   A.user_id = C.user_id
and   B.comment_user_id = C.user_id
union ALL
select A.*, C.*, null as comment, null as comment_user_id 
from articles A, 
     users    C
where A.user_id = C.user_id
;


-- ///////////////////////////////////////////////////////////////////////////////

$2b$10$PAqYS4RUr4DoBCdF.qvHhu06KIYBAT4X9nGUboBPvTT1XoulsEymO

id uuid not null default extensions.uuid_generate_v4 (),




-- ///////////////////////////////////////////////////////////////////////////////
/*
CREATE TABLE articles
(
  article_id  serial       NOT NULL,
  title       varchar(100) NOT NULL,
  user_id     varchar(50)  NOT NULL,
  contents    varchar(300) NOT NULL,
  created     timestamptz default now()   NOT NULL,
  user_id     serial       NOT NULL,
  caterory_id serial       NOT NULL,
  PRIMARY KEY (article_id)
);
COMMENT ON TABLE articles IS '게시물';
COMMENT ON COLUMN articles.user_id IS '사용자ID';


CREATE TABLE categories
(
  caterory_id serial       NOT NULL,
  name        varchar(100) NOT NULL,
  PRIMARY KEY (caterory_id)
);
COMMENT ON TABLE categories IS '카테고리관리';

CREATE TABLE comments
(
  comment_id serial       NOT NULL,
  comment    varchar(300) NOT NULL,
  article_id serial       NOT NULL,
  PRIMARY KEY (comment_id)
);
COMMENT ON TABLE comments IS '답글관리';

CREATE TABLE users
(
  user_id serial      NOT NULL,
  name    varchar(50) NOT NULL,
  PRIMARY KEY (user_id)
);

ALTER TABLE articles
  ADD CONSTRAINT FK_users_TO_articles
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE comments
  ADD CONSTRAINT FK_articles_TO_comments
    FOREIGN KEY (article_id)
    REFERENCES articles (article_id);

ALTER TABLE articles
  ADD CONSTRAINT FK_categories_TO_articles
    FOREIGN KEY (caterory_id)
    REFERENCES categories (caterory_id);
*/









