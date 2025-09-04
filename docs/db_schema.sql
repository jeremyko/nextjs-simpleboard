
-- ///////////////////////////////////////////////////////////////////////////////

drop table public.articles CASCADE ;
drop table public.comments CASCADE ;
drop table public.users CASCADE ;
drop table public.categories CASCADE ;

create table public.articles (
  article_id serial not null,
  title character varying(100) not null,
  contents text not null,  
  created timestamp not null default now(),
  category_id integer not null,
  views integer not null default 0,
  user_id uuid null,
  constraint articles_pkey primary key (article_id),
  constraint articles_category_id_fkey foreign KEY (category_id) references categories (category_id)
) ;

create table public.categories (
  category_id serial not null,
  name character varying(100) not null,
  constraint categories_pkey primary key (category_id)
) TABLESPACE pg_default;

create table public.comments (
  comment_id serial not null,
  article_id integer not null,
  comment text not null,
  comment_user_id uuid not null,
  created timestamp with time zone null default now(),
  p_comment_id integer null,
  reply_to text null,
  constraint comments_pkey primary key (comment_id),
  CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id) ON DELETE CASCADE
);
create index IF not exists comments_p_comment_id_idx on public.comments using btree (p_comment_id) TABLESPACE pg_default;
create index IF not exists comments_article_id_idx on public.comments using btree (article_id) TABLESPACE pg_default;

-- 조회수 관리 
-- 로그인 안한 경우 session_id 가 동일하면 조회수가 증가 안함 
-- 로그인 된 경우, 동일 pc 라도 계정을 다르게 로그인을 하면 조회수가 증가된다.
CREATE TABLE post_views (
    id serial PRIMARY KEY,
    article_id integer NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id text ,
    session_id uuid,
    viewed_at TIMESTAMP DEFAULT now(),    
    UNIQUE (article_id, user_id, session_id)     
);



-- not in use
create table public.users (
  user_id uuid not null,
  provider text not null,
  provider_id text not null,
  email character varying(255) null,
  nickname character varying(50) null,
  profile_image text null,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint users_pkey primary key (user_id),
  constraint uq_provider_providerid unique (provider, provider_id)
);
