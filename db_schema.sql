
-- ///////////////////////////////////////////////////////////////////////////////

drop table public.articles CASCADE ;
drop table public.comments CASCADE ;
drop table public.users CASCADE ;
drop table public.categories CASCADE ;

CREATE TABLE public.articles (
	article_id int4 DEFAULT nextval('article_id_seq'::regclass) NOT NULL,
	title varchar(100) NOT NULL,
	contents text NOT NULL,
	created timestamptz DEFAULT now() NOT NULL,
	category_id int4 NOT NULL,
	"views" int4 DEFAULT 0 NOT NULL,
	user_id uuid NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (article_id),
	CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id)
);

CREATE TABLE public.categories (
	category_id int4 DEFAULT nextval('caterory_id_seq'::regclass) NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (category_id)
);


CREATE TABLE public."comments" (
	comment_id int4 DEFAULT nextval('comment_id_seq'::regclass) NOT NULL,
	article_id int8 NOT NULL,
	"comment" text NOT NULL,
	comment_user_id uuid NOT NULL,
	created timestamptz DEFAULT now() NULL,
	p_comment_id int4 NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
	CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(article_id)
);
CREATE INDEX comments_article_id_idx ON public.comments USING btree (article_id);
CREATE INDEX comments_p_comment_id_idx ON public.comments USING btree (p_comment_id);

CREATE TABLE public.users (
	user_id uuid NOT NULL,
	provider text NOT NULL,
	provider_id text NOT NULL,
	email varchar(255) NULL,
	nickname varchar(50) NULL,
	profile_image text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT uq_provider_providerid UNIQUE (provider, provider_id),
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

