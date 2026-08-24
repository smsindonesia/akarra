--
-- PostgreSQL database dump
--

\restrict 7OdjjxgsVyvKltBbjZmKxMWRJvkA7L1z8Wuc2wMiOKoYFhZt0YE4FindafaT2cs

-- Dumped from database version 16.14 (Ubuntu 16.14-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.articles DROP CONSTRAINT IF EXISTS articles_user_id_foreign;
ALTER TABLE IF EXISTS ONLY public.articles DROP CONSTRAINT IF EXISTS articles_category_id_foreign;
DROP INDEX IF EXISTS public.users_role_index;
DROP INDEX IF EXISTS public.settings_group_index;
DROP INDEX IF EXISTS public.sessions_user_id_index;
DROP INDEX IF EXISTS public.sessions_last_activity_index;
DROP INDEX IF EXISTS public.jobs_queue_index;
DROP INDEX IF EXISTS public.failed_jobs_connection_queue_failed_at_index;
DROP INDEX IF EXISTS public.contacts_is_read_index;
DROP INDEX IF EXISTS public.contacts_interest_index;
DROP INDEX IF EXISTS public.cache_locks_expiration_index;
DROP INDEX IF EXISTS public.cache_expiration_index;
DROP INDEX IF EXISTS public.articles_status_published_at_index;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_group_key_locale_unique;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.job_batches DROP CONSTRAINT IF EXISTS job_batches_pkey;
ALTER TABLE IF EXISTS ONLY public.failed_jobs DROP CONSTRAINT IF EXISTS failed_jobs_uuid_unique;
ALTER TABLE IF EXISTS ONLY public.failed_jobs DROP CONSTRAINT IF EXISTS failed_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.contacts DROP CONSTRAINT IF EXISTS contacts_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_unique;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_name_unique;
ALTER TABLE IF EXISTS ONLY public.cache DROP CONSTRAINT IF EXISTS cache_pkey;
ALTER TABLE IF EXISTS ONLY public.cache_locks DROP CONSTRAINT IF EXISTS cache_locks_pkey;
ALTER TABLE IF EXISTS ONLY public.articles DROP CONSTRAINT IF EXISTS articles_slug_unique;
ALTER TABLE IF EXISTS ONLY public.articles DROP CONSTRAINT IF EXISTS articles_pkey;
ALTER TABLE IF EXISTS public.migrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.failed_jobs ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP SEQUENCE IF EXISTS public.migrations_id_seq;
DROP TABLE IF EXISTS public.migrations;
DROP SEQUENCE IF EXISTS public.jobs_id_seq;
DROP TABLE IF EXISTS public.jobs;
DROP TABLE IF EXISTS public.job_batches;
DROP SEQUENCE IF EXISTS public.failed_jobs_id_seq;
DROP TABLE IF EXISTS public.failed_jobs;
DROP TABLE IF EXISTS public.contacts;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.cache_locks;
DROP TABLE IF EXISTS public.cache;
DROP TABLE IF EXISTS public.articles;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id uuid NOT NULL,
    category_id uuid NOT NULL,
    user_id uuid,
    title character varying(180) NOT NULL,
    slug character varying(200) NOT NULL,
    excerpt character varying(300),
    body text,
    cover_image character varying(255),
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    meta_title character varying(70),
    meta_description character varying(160),
    published_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT articles_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying])::text[])))
);


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    name character varying(80) NOT NULL,
    slug character varying(120) NOT NULL,
    description character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id uuid NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(180) NOT NULL,
    phone character varying(30),
    interest character varying(40),
    subject character varying(180),
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id uuid,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id uuid NOT NULL,
    "group" character varying(40) NOT NULL,
    key character varying(120) NOT NULL,
    value text,
    type character varying(20) DEFAULT 'string'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    locale character varying(5) DEFAULT 'id'::character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'admin'::character varying NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.articles (id, category_id, user_id, title, slug, excerpt, body, cover_image, status, meta_title, meta_description, published_at, created_at, updated_at) FROM stdin;
01a01ab9-861b-72a8-81b3-34264ce3f848	01a01ab9-83fd-71cc-a6e7-1142ba4eb611	01a01ab9-83e3-71dd-b6e0-f1bf9a2b68b5	Kisah Berdirinya AKARRA: Dari Visi Menjadi Ekosistem Bisnis	kisah-berdirinya-akarra-dari-visi-menjadi-ekosistem-bisnis	Bermula dari keresahan tentang industri kreatif Indonesia yang berjalan sendiri-sendiri, Febri Khoirul Imam dan Nanda Fifia Putri merancang AKARRA sebagai satu ekosistem yang menyatukan fashion, kreativitas, dan strategi digital.	<p>Setiap merek besar biasanya lahir dari satu keresahan sederhana. Bagi AKARRA, keresahan itu adalah melihat betapa terpecahnya industri kreatif Indonesia — seorang desainer fashion harus mencari sendiri rumah produksinya, brand yang baru tumbuh harus berpindah dari satu vendor ke vendor lain hanya untuk membangun identitas visual, dan strategi digital sering menjadi renungan terakhir setelah produk jadi, bukan bagian dari perencanaan sejak awal.</p>\n\n<p>Febri Khoirul Imam dan Nanda Fifia Putri mendirikan AKARRA dengan gagasan yang berbeda: bagaimana jika seluruh perjalanan itu — dari produksi, desain, penyelenggaraan acara, hingga periklanan digital — bisa ditempuh dalam satu ekosistem yang saling terhubung, tanpa brand harus kehilangan jiwa aslinya di tengah jalan?</p>\n\n<h2>Dari Nama, Sudah Ada Filosofi</h2>\n<p>Nama "AKARRA" sendiri bukan sekadar label. Terinspirasi dari geometri berlian dan mandala tradisional Nusantara, identitas visualnya memadukan kemewahan modern dengan kearifan lokal — sebuah pengingat bahwa tumbuh besar tidak harus berarti melepaskan akar budaya.</p>\n\n<ul>\n    <li><strong>Berlian &amp; Kemewahan</strong> — struktur geometris yang mencerminkan kualitas premium dan eksklusivitas.</li>\n    <li><strong>Energi &amp; Dinamisme</strong> — segitiga yang saling bertautan, melambangkan inovasi dan kolaborasi.</li>\n    <li><strong>Mandala &amp; Harmoni</strong> — pola melingkar yang mengacu pada tradisi mandala Nusantara.</li>\n    <li><strong>Emas &amp; Kepercayaan</strong> — warna yang melambangkan prestise sekaligus kepercayaan jangka panjang.</li>\n</ul>\n\n<h2>Bukan Sekadar Menjual, Tapi Membangun Warisan</h2>\n<p>Sejak hari pertama, AKARRA tidak dirancang untuk sekadar menjual produk atau jasa. Tujuannya lebih jauh: membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia, sekaligus membuka jalan bagi brand lokal untuk tumbuh setara dengan nama-nama besar dunia — tanpa kehilangan akar budayanya.</p>\n\n<p>Perjalanan itu terus berlanjut hari ini, melalui tiga pilar yang saling menopang: Fashionpreneur, Creative Labs, dan Advertising. Ketiganya lahir dari satu keyakinan yang sama — bahwa keunggulan sejati ditemukan di persimpangan antara presisi dan jiwa.</p>	\N	published	Kisah Berdirinya AKARRA	Bagaimana AKARRA lahir dari visi untuk menyatukan fashion, desain kreatif, event, dan periklanan digital dalam satu ekosistem bisnis.	2026-08-07 15:52:41	2026-08-19 15:52:41	2026-08-19 15:52:41
01a01ab9-8620-7199-b633-74b9cb20eaa4	01a01ab9-83fd-71cc-a6e7-1142ba4eb611	01a01ab9-83e3-71dd-b6e0-f1bf9a2b68b5	Mengenal Tiga Pilar AKARRA: Fashionpreneur, Creative Labs, dan Advertising	mengenal-tiga-pilar-akarra-fashionpreneur-creative-labs-dan-advertising	Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya — dari produksi hingga strategi digital.	<p>Salah satu hal yang membedakan AKARRA dari agensi atau rumah produksi pada umumnya adalah struktur layanannya yang tidak berdiri sendiri-sendiri. Ketiga pilar — Fashionpreneur, Creative Labs, dan Advertising — dirancang untuk saling menopang, sehingga sebuah brand bisa ditemani sejak ide pertama hingga dikenal luas, tanpa harus berpindah mitra di setiap tahap.</p>\n\n<h2>01 / Fashionpreneur</h2>\n<p>Fashionpreneur adalah ekosistem komprehensif bagi desainer mapan maupun label yang baru tumbuh, untuk berkembang tanpa mengorbankan integritas kualitas. AKARRA menangani kerumitan rantai pasok — dari sampling di atelier hingga produksi skala besar yang etis — supaya brand bisa fokus sepenuhnya pada jiwa produknya sendiri.</p>\n<p>Dua layanan inti di pilar ini adalah <strong>The Atelier</strong> (sampling bespoke dan pengembangan pola teknis untuk siluet high-fashion) dan <strong>Global Production</strong> (manufaktur skala kecil yang etis serta sourcing tekstil berskala besar dengan fokus keberlanjutan).</p>\n\n<h2>02 / Creative Labs</h2>\n<p>Jika Fashionpreneur adalah tangan yang memproduksi, Creative Labs adalah mesin intelektual yang menerjemahkan nilai brand menjadi narasi visual dan pengalaman yang membekas di benak audiens yang semakin kritis.</p>\n<p>Di dalamnya ada <strong>Art Direction</strong> — kurasi identitas visual, citra kampanye, dan panduan brand berkualitas tinggi — serta <strong>Immersive Events</strong>, mulai dari peluncuran produk bespoke hingga peragaan busana yang dirancang untuk membangkitkan kedekatan emosional, bukan sekadar hiburan sesaat.</p>\n\n<h2>03 / Advertising</h2>\n<p>Pilar ketiga menjembatani semua kerja kreatif itu ke pasar yang tepat. Fokusnya ada pada strategi digital dan periklanan yang terukur — penempatan media, pengelolaan media sosial, hingga positioning brand — supaya karya yang telah dibangun dengan susah payah benar-benar sampai ke audiens yang dituju.</p>\n\n<h2>Mengapa Harus Tiga Pilar dalam Satu Atap?</h2>\n<p>Karena keputusan yang baik di satu pilar selalu memengaruhi pilar lainnya. Pilihan tekstil di Fashionpreneur akan menentukan bagaimana produk difoto dan diceritakan di Creative Labs, dan narasi itu pada akhirnya membentuk cara sebuah kampanye ditempatkan di Advertising. Dengan ketiganya berjalan dalam satu ekosistem, brand tidak perlu menerjemahkan ulang visinya setiap kali berpindah tangan.</p>	\N	published	Tiga Pilar Ekosistem AKARRA	Fashionpreneur, Creative Labs, dan Advertising — tiga pilar yang membentuk ekosistem layanan AKARRA bagi brand fashion dan kreatif Indonesia.	2026-08-13 15:52:41	2026-08-19 15:52:41	2026-08-19 15:52:41
01a01ab9-8623-70b8-afa2-459321ddd31c	01a01ab9-83fd-71cc-a6e7-1142ba4eb611	01a01ab9-83e3-71dd-b6e0-f1bf9a2b68b5	Komitmen AKARRA terhadap Keberlanjutan dan Budaya Lokal Indonesia	komitmen-akarra-terhadap-keberlanjutan-dan-budaya-lokal-indonesia	Menjadi brand berkelas dunia bukan berarti melepaskan akar. Begini cara AKARRA menyeimbangkan pertumbuhan bisnis dengan tanggung jawab terhadap lingkungan dan warisan budaya.	<p>Ada satu pertanyaan yang terus dipegang AKARRA sejak awal berdiri: apakah mungkin sebuah brand tumbuh menjadi kelas dunia tanpa mengorbankan tempat ia berasal? Bagi AKARRA, jawabannya bukan hanya "mungkin" — tetapi menjadi salah satu prinsip yang mendasari setiap keputusan bisnis yang diambil.</p>\n\n<h2>Keberlanjutan Bukan Jargon, Tapi Standar Kerja</h2>\n<p>Di pilar Fashionpreneur, komitmen ini terlihat nyata pada layanan Global Production — manufaktur skala kecil yang etis dan sourcing tekstil dengan fokus keberlanjutan. Ini bukan lapisan pemasaran yang ditambahkan belakangan, melainkan bagian dari cara AKARRA memilih mitra produksi dan bahan baku sejak tahap paling awal.</p>\n<p>Pendekatan ini memang menuntut lebih banyak kesabaran dibanding produksi massal konvensional. Namun bagi AKARRA, kualitas yang bertahan lama — baik dari sisi material maupun dampaknya terhadap lingkungan — selalu lebih bernilai daripada kecepatan semata.</p>\n\n<h2>Akar Budaya sebagai Fondasi, Bukan Sekadar Ornamen</h2>\n<p>Penghormatan terhadap budaya lokal juga tertanam sejak dari identitas visual AKARRA sendiri. Motif mandala yang menjadi ciri khas logo bukan dipilih karena sedang tren, melainkan karena mengacu langsung pada tradisi mandala Nusantara — pola melingkar yang telah lama menjadi simbol harmoni dalam budaya Indonesia.</p>\n<p>Filosofi yang sama juga membentuk cara AKARRA bekerja dengan para perajin dan pelaku industri kreatif lokal: bukan sebagai vendor yang sekadar dibayar untuk mengeksekusi, melainkan sebagai mitra yang turut membentuk arah kreatif setiap karya.</p>\n\n<h2>Visi ke Depan</h2>\n<p>AKARRA ingin menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia — namun tetap berakar pada budaya lokal. Bagi AKARRA, keunggulan sejati justru ditemukan pada titik temu antara presisi matematis sebuah strategi bisnis dan jiwa artistik yang diwariskan turun-temurun.</p>\n<p>Itulah sebabnya setiap ekspansi yang dilakukan AKARRA — baik ke kategori produk baru, kemitraan strategis, maupun pasar yang lebih luas — selalu diuji dengan satu pertanyaan yang sama: apakah langkah ini memperkuat akar, atau justru menjauhkannya?</p>	\N	published	Keberlanjutan & Budaya Lokal di AKARRA	Bagaimana AKARRA menjaga keseimbangan antara pertumbuhan bisnis, praktik produksi yang etis, dan penghormatan terhadap budaya lokal Indonesia.	2026-08-18 15:52:41	2026-08-19 15:52:41	2026-08-19 15:52:41
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, created_at, updated_at) FROM stdin;
01a01ab9-83ee-705e-b563-ab6e8171cb02	Fashion & Tren	fashion-tren	Perkembangan industri fashion dan arah tren.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-83f1-7339-a3f7-9909ec2f2ead	Creative Labs	creative-labs	Proses kreatif, desain, dan produksi.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-83f4-7058-b2ec-970f7767699d	Event & Pertunjukan	event-pertunjukan	Penyelenggaraan acara dan pengalaman brand.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-83f7-70a8-8197-eff3b575364a	Digital & Periklanan	digital-periklanan	Strategi digital, media, dan periklanan.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-83fa-733f-bc1e-90f8a15028f6	Tips Bisnis Fashion	tips-bisnis-fashion	Panduan praktis membangun bisnis fashion.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-83fd-71cc-a6e7-1142ba4eb611	Berita Perusahaan	berita-perusahaan	Kabar terbaru dari ekosistem AKARRA.	2026-08-19 15:52:40	2026-08-19 15:52:40
01a01ab9-8400-7307-b18b-c957b48cde1d	Studi Kasus Klien	studi-kasus-klien	Cerita kerja sama dan hasilnya.	2026-08-19 15:52:40	2026-08-19 15:52:40
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contacts (id, name, email, phone, interest, subject, message, is_read, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_01_01_000100_create_categories_table	1
5	2026_01_01_000200_create_articles_table	1
6	2026_01_01_000300_create_contacts_table	1
7	2026_01_01_000400_create_settings_table	1
8	2026_07_24_044734_add_role_to_users_table	1
9	2026_08_11_140113_add_locale_to_settings_table	1
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, "group", key, value, type, created_at, updated_at, locale) FROM stdin;
01a01ab9-8407-7001-a457-f4a8bb9a1c2f	global	site_name	AKARRA	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-840e-71fc-8833-039752a5aa1b	global	tagline	Ecosystem of Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8412-7373-bdab-9f60b33227b5	global	description	Ekosistem bisnis terintegrasi di bidang fashion, desain kreatif, event, dan periklanan digital.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8415-71d9-b9d4-58d9f1ea7333	global	founded_year		string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8417-73d5-bd4e-d88ac990c4aa	global	address		string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-841a-71ba-a65f-df4829814804	global	phone		string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8424-7022-bbab-8346e230853e	global	office_hours	Senin sampai Jumat, pukul 09.00 s.d. 17.00 WIB	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8427-73ab-9132-092d6db0303c	global	social	[{"platform":"instagram","url":"","label":"Instagram"},{"platform":"tiktok","url":"","label":"TikTok"},{"platform":"linkedin","url":"","label":"LinkedIn"}]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-842f-735a-bade-e099edea106b	global	footer_note	Seluruh hak cipta dilindungi.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8434-7265-8394-685f8f3139a2	global	twitter_handle		string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-843a-7017-9179-8132dd3eb0c1	home	hero_title	Ecosystem of Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-843d-7284-87ab-d573318f7dd0	home	hero_title_emphasis	Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-844a-7361-81e5-895b77e62480	home	hero_image		string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-844c-71e4-889f-4f742f500194	home	narrative_title	Membangun Warisan, Bukan Sekadar Bisnis	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8450-73d9-bbc3-9eb4ad079ca1	home	narrative_body	AKARRA bergerak di industri fashion, desain kreatif, event, dan periklanan digital. Melalui tiga pilar utama, kami tidak hanya menjual produk, tetapi membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-845c-7378-a88c-b1fa9867917b	home	narrative_badge	Est. 2024	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8467-7295-8427-2b061cfeba78	home	services_subtitle	Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8469-71d2-b12c-1b831eb0fd50	home	services_cta_label	Lihat seluruh layanan	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-846e-72f6-a91d-f204801480ec	home	solutions_subtitle	Rangkaian produk dan karya yang lahir dari ekosistem kami.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8472-7106-b059-f5c5e5831c10	home	story_title	Cerita di Balik AKARRA	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8474-70c7-8fce-e96c718ee0b4	home	story_body	Kami percaya setiap brand memiliki cerita yang layak diceritakan dengan elegan. Bersama kami, Anda tidak hanya membangun bisnis, tetapi juga membangun warisan.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8476-7296-94f7-2c6a0c53f8bf	home	story_image	/images/content/home-story.jpg	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-847e-72c1-857e-27d8a9d4755b	home	founders_subtitle	Dua orang di balik arah dan standar AKARRA.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8480-700b-8179-05aa20ea341c	home	form_title	Mari Berkolaborasi	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8482-73cc-9f00-01ef4aa35362	home	form_subtitle	Konsultasi awal gratis, tanpa komitmen. Ceritakan apa yang sedang Anda bangun.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8484-7332-9860-11e77c779c0f	home	form_cta_label	Kirim pesan	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8488-7261-96bf-08da5df37a93	ecosystem	hero_title	Ecosystem of Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-848a-71ca-8638-2f5d97f5e461	ecosystem	hero_title_emphasis	Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8431-72c3-b46c-aa4bb50df12e	global	og_image	/storage/settings/2026/08/3WguMOu63aDaYTYLxhcGFkPx.jpg	string	2026-08-19 15:52:40	2026-08-24 10:01:45	id
01a01ab9-841e-717f-8a6c-9d6da9fe9396	global	whatsapp	6285179973943	string	2026-08-19 15:52:40	2026-08-24 10:36:08	id
01a01ab9-8421-715a-a52e-72969e38b936	global	email	hello@akarra.co.id	string	2026-08-19 15:52:40	2026-08-24 10:36:08	id
01a01ab9-848e-7332-b014-ffd899e982d9	ecosystem	story_title	Cerita Kami	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8490-7172-909d-6d5871949bb0	ecosystem	story_body	AKARRA didirikan oleh Febri Khoirul Imam dan Nanda Fifia Putri, lahir dari visi untuk menciptakan platform bisnis yang tidak hanya menjual produk, tetapi juga membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8491-713d-ad4e-87658772ca59	ecosystem	philosophy_title	Filosofi Nama & Logo	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8493-701f-baf6-3727ae3a36ee	ecosystem	philosophy_body	Logo AKARRA terinspirasi dari geometri berlian dan mandala tradisional, perpaduan antara kemewahan modern dan kearifan lokal.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8495-73dc-a522-5b2eab5e6477	ecosystem	philosophy_items	[{"title":"Berlian & Kemewahan","body":"Struktur geometris berlian mencerminkan kualitas premium dan eksklusivitas."},{"title":"Energi & Dinamisme","body":"Segitiga yang saling bertautan melambangkan inovasi dan kolaborasi."},{"title":"Mandala & Harmoni","body":"Pola melingkar mengacu pada tradisi mandala Nusantara."},{"title":"Emas & Kepercayaan","body":"Warna emas melambangkan prestise dan kepercayaan."}]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-8498-7371-a494-9b761c37539d	ecosystem	standard_title	The AKARRA Standard	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-849b-70cf-b66c-3e62b640a79b	ecosystem	standard_body	Standar tertinggi di setiap produk dan layanan, sesuai nilai Excellence dan Elegance yang kami pegang.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84a1-7282-be87-89e8d64a7dde	ecosystem	values	[{"name":"Excellence","label":"Keunggulan","body":"Standar tertinggi dalam setiap produk dan layanan."},{"name":"Integrity","label":"Integritas","body":"Transparansi dan kepercayaan di setiap kemitraan."},{"name":"Innovation","label":"Inovasi","body":"Terus berevolusi dan berpikir di luar konvensi."},{"name":"Collaboration","label":"Kolaborasi","body":"Tumbuh bersama klien, mitra, dan komunitas kreatif."},{"name":"Elegance","label":"Elegansi","body":"Estetika dan keindahan dalam setiap karya."}]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84a5-71eb-90c8-6361c0518f65	ecosystem	vision_body	Menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia dengan akar budaya lokal.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84a8-70c9-91fa-26fd1be95df4	ecosystem	mission	["Membangun platform fashion terintegrasi dari produksi hingga distribusi.","Menghadirkan layanan desain dan event kreatif berkelas premium.","Memperkuat brand lokal melalui strategi digital dan periklanan inovatif.","Menciptakan ekosistem kolaboratif untuk pelaku industri kreatif Indonesia.","Mendorong pertumbuhan bisnis klien melalui solusi holistik dan terukur."]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84b0-70bd-83c4-7567b485b506	products	hero_title	The Artifacts of Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84b2-7161-a701-b43225d725cd	products	hero_title_emphasis	Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84bd-7208-9019-c10fade89db5	products	labs_title	AKARRA Labs	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84bf-7039-83b6-ec6a05b945a3	products	labs_body	Ruang eksperimen desain dan pengembangan produk, tempat ide diuji sebelum menjadi karya.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84c8-71d8-991b-3f9608cfa706	products	digital_body	Perencanaan dan eksekusi kampanye digital yang terukur, dari penempatan media hingga pengelolaan performa.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84d7-7356-9164-8df76924cc9c	services	hero_title	Architecting Excellence.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84d9-7042-99b0-f307447b65ac	services	hero_title_emphasis	Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84db-71d8-b235-32c21cdcca59	services	hero_subtitle	Apa yang kami kerjakan bersama Anda, dari ide pertama hingga brand yang dikenal.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84ef-7342-952a-68c61b1b1312	services	why_title	Mengapa AKARRA	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84f0-70a1-b074-3426ade0ad10	services	why_items	[{"title":"Ekosistem lengkap dalam satu atap","body":"Produksi fashion, desain kreatif, event, hingga periklanan digital ditangani satu mitra."},{"title":"Kualitas premium & elegan","body":"Standar tertinggi di setiap produk dan layanan."},{"title":"Berakar pada budaya lokal","body":"Brand berkelas dunia tanpa melepaskan akar budaya Indonesia."},{"title":"Kolaboratif & transparan","body":"Kami tumbuh bersama klien, mitra, dan komunitas kreatif."},{"title":"Solusi holistik & terukur","body":"Pendampingan dari ide pertama hingga eksekusi."}]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84f4-71ff-aa1d-853cb4ec8c63	services	cta_subtitle	Konsultasi awal gratis, tanpa komitmen.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84f6-7092-8199-190fe4ce4c0b	services	cta_label	Mulai kolaborasi	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84f8-7309-898b-4c9555087bb4	services	cta_secondary_label	Concierge@akarra.com	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84fc-7367-8983-aafe8d1cbc8a	founders	hero_title	The Stewardship of Legacy.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-84fd-7120-a700-bd8c38a9ab37	founders	hero_title_emphasis	Legacy	string	2026-08-19 15:52:40	2026-08-19 15:52:40	id
01a01ab9-850f-7041-a70e-5d5a6b047089	global	site_name	AKARRA	string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8511-7230-ba6c-bdc102fe4216	global	tagline	Ecosystem of Excellence	string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8513-7182-ac66-174117846f5d	global	description	Ekosistem bisnis terintegrasi di bidang fashion, desain kreatif, event, dan periklanan digital.	string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8515-73ef-9314-add19b7df1af	global	founded_year		string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8518-70c2-8436-f804dc408b8e	global	address		string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-851a-7013-b6e7-9494d1b72d80	global	phone		string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8520-71b5-a8e6-af482e8c8d63	global	office_hours	Senin sampai Jumat, pukul 09.00 s.d. 17.00 WIB	string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-851e-7398-8fc7-1a87f8057e95	global	email	hello@akarra.co.id	string	2026-08-19 15:52:40	2026-08-24 10:36:08	en
01a01ab9-8524-71a3-98f8-bf01ee776396	global	nav	[{"label":"Ecosystem","path":"\\/ecosystem"},{"label":"Products","path":"\\/products"},{"label":"Services","path":"\\/services"},{"label":"Articles","path":"\\/articles"},{"label":"Founders","path":"\\/founders"}]	json	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8526-72cb-9222-411a7de38abb	global	nav_cta_label	Start a Conversation	string	2026-08-19 15:52:40	2026-08-19 15:52:40	en
01a01ab9-8529-7034-9827-c664016f7899	global	footer_note	Seluruh hak cipta dilindungi.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-852e-7358-b8ff-28c867bc5341	global	twitter_handle		string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-852f-707f-a69a-93f1c4064229	home	hero_eyebrow	A Legacy in the Making	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8531-7175-9715-cba922f17c0c	home	hero_title	Ecosystem of Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8533-7028-80ac-175b47164495	home	hero_title_emphasis	Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8535-7373-898b-48cc493ccae4	home	hero_subtitle	A sophisticated convergence of Fashionpreneurial spirit, Creative Labs innovation, and Strategic Advertising excellence. AKARRA is built for the visionaries of tomorrow.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8537-7105-aced-f72b94071dab	home	hero_cta_label	Explore the Ecosystem	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8539-7241-8da7-4db31bf70913	home	hero_secondary_cta_label	Our Philosophy	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-853b-7255-8c26-47c1799c63b9	home	hero_image		string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-853d-7068-b925-23ab13e31037	home	narrative_title	Membangun Warisan, Bukan Sekadar Bisnis	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-853e-731e-a58d-370076dcb163	home	narrative_body	AKARRA bergerak di industri fashion, desain kreatif, event, dan periklanan digital. Melalui tiga pilar utama, kami tidak hanya menjual produk, tetapi membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8542-700b-be1e-0a1bcab742b1	home	narrative_quote	We believe that true prestige is found in the intersection of mathematical precision and artistic soul. Our journey is about creating impact that resonates across generations.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8545-717b-9fba-1500811272bb	home	narrative_quote_attribution	The Founders of AKARRA	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8547-72cb-8a4b-404a318e66ed	home	narrative_badge	Est. 2024	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-854a-706c-89a6-b4b6a61ad3ae	home	values	[{"name":"Excellence","body":"Uncompromising quality in every stitch, frame, and strategy we execute."},{"name":"Integrity","body":"Building trust through transparency and ethical leadership in all domains."},{"name":"Innovation","body":"Pushing boundaries through creative experimentation and modern technology."},{"name":"Elegance","body":"A commitment to refined aesthetics that speak without needing to shout."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-854d-70cc-98b0-3f779278d4ec	home	services_eyebrow	Our Three Pillars	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-854f-7362-8567-d6f8ce63d552	home	services_title	The Services Ecosystem	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8551-721e-a508-725a1a9b2db1	home	services_subtitle	Tiga pilar yang saling menopang, dirancang untuk menemani brand di setiap tahap pertumbuhannya.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8554-7316-989c-8f397e164801	home	services_cta_label	Lihat seluruh layanan	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8557-70d1-9e62-7b1d39a1cc6b	home	solutions_title	Curated Solutions	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-855a-72ef-97f8-cf76ea36db5f	home	solutions_subtitle	Rangkaian produk dan karya yang lahir dari ekosistem kami.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-855f-705a-9c26-a43a75d42121	home	story_title	Cerita di Balik AKARRA	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8561-7324-abd7-d348614af22a	home	story_body	Kami percaya setiap brand memiliki cerita yang layak diceritakan dengan elegan. Bersama kami, Anda tidak hanya membangun bisnis, tetapi juga membangun warisan.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8564-7092-a5a8-1c9a1bb8e6c8	home	story_image	/images/content/home-story.jpg	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8569-719d-8bf4-e822a05f1bde	home	founders_title	Meet the Founders	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-856c-70bc-94bc-8e45f16c5c8e	home	founders_subtitle	Dua orang di balik arah dan standar AKARRA.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-856e-736b-9330-86a2e169b15f	home	form_title	Mari Berkolaborasi	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8571-7176-9db9-232ba2867355	home	form_subtitle	Konsultasi awal gratis, tanpa komitmen. Ceritakan apa yang sedang Anda bangun.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8573-70be-813d-e7dec9e2c93e	home	form_cta_label	Kirim pesan	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8575-7226-9c33-302d600fdd4e	ecosystem	hero_eyebrow	The Architecture of Aspiration	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8577-70d9-90ad-9222fbacb627	ecosystem	hero_title	Ecosystem of Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8579-71be-9db0-766d159745e4	ecosystem	hero_title_emphasis	Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-857b-72b6-b8f0-fd087d72c006	ecosystem	hero_subtitle	A multi-disciplinary sanctuary where precision meets poetry. AKARRA is not merely a brand; it is a unified sensory landscape where fashion, art, and strategy coalesce into a singular, prestigious standard.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-857d-7288-8e6c-b2306fed128c	ecosystem	story_title	Cerita Kami	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-857f-7095-bb3a-8f8f1d6e55cc	ecosystem	story_body	AKARRA didirikan oleh Febri Khoirul Imam dan Nanda Fifia Putri, lahir dari visi untuk menciptakan platform bisnis yang tidak hanya menjual produk, tetapi juga membangun identitas dan dampak nyata bagi komunitas fashion dan kreatif Indonesia.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8581-7390-92e0-902cdf10c761	ecosystem	philosophy_title	Filosofi Nama & Logo	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8583-7198-8bb4-9bbbf01031dc	ecosystem	philosophy_body	Logo AKARRA terinspirasi dari geometri berlian dan mandala tradisional, perpaduan antara kemewahan modern dan kearifan lokal.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-850d-70e2-a9b4-d5dac261bd75	founders	cta_secondary_label	Lihat Ekosistem	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-852b-7246-870a-a9592f806877	global	og_image	/storage/settings/2026/08/3WguMOu63aDaYTYLxhcGFkPx.jpg	string	2026-08-19 15:52:41	2026-08-24 10:01:45	en
01a01ab9-8584-730d-afd5-7902c261a6b8	ecosystem	philosophy_items	[{"title":"Berlian & Kemewahan","body":"Struktur geometris berlian mencerminkan kualitas premium dan eksklusivitas."},{"title":"Energi & Dinamisme","body":"Segitiga yang saling bertautan melambangkan inovasi dan kolaborasi."},{"title":"Mandala & Harmoni","body":"Pola melingkar mengacu pada tradisi mandala Nusantara."},{"title":"Emas & Kepercayaan","body":"Warna emas melambangkan prestise dan kepercayaan."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8587-7241-97b1-a3add81347b6	ecosystem	standard_title	The AKARRA Standard	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-858a-732d-a11b-fe551db9956b	ecosystem	standard_body	Standar tertinggi di setiap produk dan layanan, sesuai nilai Excellence dan Elegance yang kami pegang.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-858f-70f1-be12-d3f7f8b346f2	ecosystem	values	[{"name":"Excellence","label":"Keunggulan","body":"Standar tertinggi dalam setiap produk dan layanan."},{"name":"Integrity","label":"Integritas","body":"Transparansi dan kepercayaan di setiap kemitraan."},{"name":"Innovation","label":"Inovasi","body":"Terus berevolusi dan berpikir di luar konvensi."},{"name":"Collaboration","label":"Kolaborasi","body":"Tumbuh bersama klien, mitra, dan komunitas kreatif."},{"name":"Elegance","label":"Elegansi","body":"Estetika dan keindahan dalam setiap karya."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8592-71a1-9e3d-204c3791812f	ecosystem	vision_title	A Global Vision of Shared Success	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8595-737d-be76-94b483a69ddc	ecosystem	vision_body	Menjadi ekosistem bisnis fashion dan kreatif terdepan di Indonesia yang melahirkan brand-brand berkelas dunia dengan akar budaya lokal.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8599-710f-ae56-00cba18f34da	ecosystem	mission	["Membangun platform fashion terintegrasi dari produksi hingga distribusi.","Menghadirkan layanan desain dan event kreatif berkelas premium.","Memperkuat brand lokal melalui strategi digital dan periklanan inovatif.","Menciptakan ekosistem kolaboratif untuk pelaku industri kreatif Indonesia.","Mendorong pertumbuhan bisnis klien melalui solusi holistik dan terukur."]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-859c-7147-9935-d6fb642587af	ecosystem	stats	[{"value":"12","label":"Global Ateliers"},{"value":"450+","label":"Artisans"},{"value":"24","label":"Strategic Partners"},{"value":"100%","label":"Ethical Sourcing"}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-859f-7249-b781-e057b4428143	products	hero_eyebrow	Curated Collections	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85a1-725f-a1b8-c9aa7fea1549	products	hero_title	The Artifacts of Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85a4-72ce-9cca-875e5ea16556	products	hero_title_emphasis	Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85a6-71af-bfae-3c7e4ecdd2e3	products	hero_subtitle	Explore AKARRA's product ecosystem, where high-performance logic meets artisanal craftsmanship. Our solutions are designed for those who demand uncompromising results.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85a9-70eb-b546-71174ce90bfd	products	textile_title	Textile Engineering & Fashion	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85ac-71b3-a5d8-fcf0d3116a1b	products	textile_body	Precision-tailored garments that redefine high-net-worth identity through rare fibers and architectural silhouettes.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85b0-7340-8bce-110d44f8e981	products	labs_title	AKARRA Labs	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85b3-70f4-8490-439f057d2038	products	labs_body	Ruang eksperimen desain dan pengembangan produk, tempat ide diuji sebelum menjadi karya.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85b5-71e0-a07a-683cd6de2682	products	labs	[{"title":"Material Bio-Synthesis","body":"Developing sustainable, lab-grown alternatives to rare earth materials for luxury interiors."},{"title":"Cognitive Branding","body":"A methodology for creating brand resonance through neuro-aesthetic principles and sensory mapping."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85ba-70e3-a4af-e94f43c1e5b2	products	digital_title	Strategic Dominance in Digital Realms	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85bc-72c0-b03e-d8c78718695d	products	digital_body	Perencanaan dan eksekusi kampanye digital yang terukur, dari penempatan media hingga pengelolaan performa.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85bf-7278-a4a7-d3304e8d2336	products	digital_items	[{"title":"Omnichannel Mastery","body":"Seamlessly integrating brand narrative across 12+ touchpoints for a unified, elite user experience."},{"title":"Data-Driven Narratives","body":"Leveraging proprietary algorithms to forecast cultural shifts and position brands ahead of the curve."},{"title":"High-Conversion Visuals","body":"Cinematic production standards applied to programmatic advertising for maximum prestige and ROI."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85c1-7176-b6cc-539906751725	products	cta_title	Ready to redefine your baseline?	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85c3-7122-92c6-206f24fcc5ae	products	cta_subtitle	Our limited-client engagement model ensures each partnership receives the full weight of AKARRA's strategic and creative machinery.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85c5-7182-94d1-eba6cf74c1ba	products	cta_label	Request Audit	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85c7-7325-a61f-e42f6c14528a	products	cta_secondary_label	Join the Waitlist	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85ca-7019-ac51-a11c76fa3626	services	hero_title	Architecting Excellence.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85cc-72a6-b804-5649e23e0930	services	hero_title_emphasis	Excellence	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85ce-711b-ac57-fb65debfb5e3	services	hero_subtitle	Apa yang kami kerjakan bersama Anda, dari ide pertama hingga brand yang dikenal.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85d2-7172-8161-b07f025ccd58	services	hero_eyebrow	Our Capabilities	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-858c-73d6-8ce0-55f2a8a47893	ecosystem	standard_image	/storage/settings/2026/08/Riuja9nv1G8wCTrrNtB0rEZz.jpg	string	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-8509-717a-a780-ff3b0f93a823	founders	cta_subtitle	Rasakan layanan penasihat khusus dan ekosistem yang mendefinisikan gaya hidup AKARRA.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8506-720a-9505-75d05c6519f8	founders	cta_title	Bergabunglah dengan Lingkaran Utama.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84fa-733a-ab80-2cf81d552f35	founders	hero_eyebrow	Arsitek Nilai	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84ff-7373-bebc-a196a52f79b6	founders	hero_subtitle	AKARRA didirikan atas prinsip bahwa keunggulan bukanlah sebuah tindakan, melainkan kebiasaan. Kepemimpinan kami berdedikasi penuh pada pembinaan kekayaan, kebijaksanaan, dan warisan abadi yang cermat bagi para visioner masa kini.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85db-7301-bd5e-f9b4c93d674a	services	growth_title	Digital Strategy & Growth	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85dd-7340-9383-6dfdb6c82f43	services	growth_body	Data-driven precision meets creative intuition. We don't just find your audience; we cultivate a community of advocates.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85e0-73bd-99c3-2e1d39877b2f	services	amplification_cards	[{"title":"Digital Strategy","body":"Comprehensive market analysis and growth mapping for the luxury sector.","bullets":["Market Intelligence","Funnel Optimization"]},{"title":"Content Production","body":"High-end video, editorial photography, and interactive storytelling.","bullets":["4K Editorial Video","Social Narratives"]},{"title":"Brand Growth","body":"Strategic partnerships, influencer seeding, and global expansion.","bullets":["Strategic PR","Cross-Border Scaling"]}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85e2-710e-a328-6ba619caa9d4	services	why_title	Mengapa AKARRA	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85e5-7041-9ae2-ba0727ea84c7	services	why_items	[{"title":"Ekosistem lengkap dalam satu atap","body":"Produksi fashion, desain kreatif, event, hingga periklanan digital ditangani satu mitra."},{"title":"Kualitas premium & elegan","body":"Standar tertinggi di setiap produk dan layanan."},{"title":"Berakar pada budaya lokal","body":"Brand berkelas dunia tanpa melepaskan akar budaya Indonesia."},{"title":"Kolaboratif & transparan","body":"Kami tumbuh bersama klien, mitra, dan komunitas kreatif."},{"title":"Solusi holistik & terukur","body":"Pendampingan dari ide pertama hingga eksekusi."}]	json	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85e7-719f-a0b4-1a87b5398ffb	services	cta_title	Ready to redefine your legacy?	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85e9-7372-8a12-e227ef5effb6	services	cta_subtitle	Konsultasi awal gratis, tanpa komitmen.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85eb-73bb-98e4-dc74780d6b7f	services	cta_label	Mulai kolaborasi	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85ee-72f2-bbea-3a0caee36d36	services	cta_secondary_label	Concierge@akarra.com	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85f0-712c-ad4b-026b42df8b42	founders	hero_eyebrow	Architects of Value	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85f2-7247-bc36-cd7266671914	founders	hero_title	The Stewardship of Legacy.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85f5-7378-b4c2-e04e6effa237	founders	hero_title_emphasis	Legacy	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85f6-7314-9e6b-c8e6b74c3c3a	founders	hero_subtitle	AKARRA was founded on the principle that excellence is not an act, but a habit. Our leadership is dedicated to the meticulous cultivation of wealth, wisdom, and lasting heritage for the modern visionary.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85fa-703f-b258-b5359535a8e9	founders	quote	A foundation built on integrity, a future shaped by vision.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85fc-73e1-bf10-1ead250bb890	founders	cta_title	Join the Inner Circle.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-85fe-7239-9fcd-f8f0b0d09007	founders	cta_subtitle	Experience the bespoke advisory and ecosystem services that define the AKARRA lifestyle.	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8600-72b6-854d-02818ad1f98c	founders	cta_label	Request Consultation	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8602-7106-8fa4-c2fa1889c394	founders	cta_secondary_label	View Ecosystem	string	2026-08-19 15:52:41	2026-08-19 15:52:41	en
01a01ab9-8486-71ee-be89-9b6cccdaa4e5	ecosystem	hero_eyebrow	Arsitektur dari Sebuah Aspirasi	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-848c-72cd-9e3c-e89fcbe8271c	ecosystem	hero_subtitle	Sebuah ruang lintas disiplin tempat presisi bertemu puisi. AKARRA bukan sekadar sebuah brand; ia adalah lanskap indrawi yang menyatu, tempat fashion, seni, dan strategi melebur menjadi satu standar yang prestisius.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-849e-72ca-be3d-19358f3a7f33	ecosystem	standard_image	/storage/settings/2026/08/Riuja9nv1G8wCTrrNtB0rEZz.jpg	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84ab-70f5-b219-b233e3c66392	ecosystem	stats	[{"value":"12","label":"Atelier Global"},{"value":"450+","label":"Pengrajin"},{"value":"24","label":"Mitra Strategis"},{"value":"100%","label":"Sumber Berkelanjutan yang Etis"}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84a3-715c-bb1c-58457c7db1ff	ecosystem	vision_title	Visi Global untuk Kesuksesan Bersama	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-850b-71b7-8b09-41c8a64482c2	founders	cta_label	Ajukan Konsultasi	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85f8-7177-acb7-2cd5bfc2f731	founders	people	[{"name":"Febri Khoirul Imam","role":"Direktur Utama","body":"With over two decades of experience in strategic investment and institutional management, Febri Khoirul Imam leads AKARRA with a focus on structural resilience and long-term capital preservation. His background in global financial markets provides the analytical backbone for AKARRA’s most ambitious ecosystems.","portrait":"\\/storage\\/settings\\/2026\\/08\\/6nSGvnK2vgmnocHjUhkzQpZN.jpg","quote":"Legacy is not what we leave for people, it is what we leave within them. At AKARRA, we build the frameworks where that impact can endure.","legacy_body":"Febri believes that building a legacy requires more than just financial success; it requires a commitment to excellence in every detail. His philosophy centers on ‘Integrated Stewardship,’ the belief that wealth and influence must be managed as a cohesive, purposeful whole."},{"name":"Nanda Fifia Putri","role":"Komisaris","body":"Nanda Fifia Putri brings a refined perspective to AKARRA’s board, specializing in brand heritage and philanthropic governance. Her career has been defined by the intersection of high-culture and high-finance, ensuring that AKARRA’s products and services maintain their soul as they scale.","portrait":"\\/storage\\/settings\\/2026\\/08\\/b4PClzlPHjsjNyvl7a6gptYZ.jpg","quote":"Visionary leadership is about seeing the invisible threads that connect today’s decisions to tomorrow’s heritage.","legacy_body":"Nanda’s philosophy is rooted in ‘Cultural Capital.’ She advocates for the preservation of values alongside value, ensuring that the AKARRA brand serves as a hallmark of prestige and intellectual depth for generations to come."}]	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-8501-735f-a68e-4561debcacd4	founders	people	[{"name":"Febri Khoirul Imam","role":"Direktur Utama","body":"Dengan pengalaman lebih dari dua dekade dalam investasi strategis dan manajemen institusional, Febri Khoirul Imam memimpin AKARRA dengan fokus pada ketahanan struktural dan pelestarian modal jangka panjang. Latar belakangnya di pasar keuangan global menjadi tulang punggung analitis bagi ekosistem-ekosistem paling ambisius AKARRA.","portrait":"\\/storage\\/settings\\/2026\\/08\\/6nSGvnK2vgmnocHjUhkzQpZN.jpg","quote":"Warisan bukanlah apa yang kita tinggalkan untuk orang lain, melainkan apa yang kita tanamkan dalam diri mereka. Di AKARRA, kami membangun kerangka kerja tempat dampak itu bisa bertahan lama.","legacy_body":"Febri percaya bahwa membangun sebuah warisan membutuhkan lebih dari sekadar kesuksesan finansial; dibutuhkan komitmen pada keunggulan di setiap detail. Filosofinya berpusat pada 'Integrated Stewardship' — keyakinan bahwa kekayaan dan pengaruh harus dikelola sebagai satu kesatuan yang utuh dan penuh tujuan."},{"name":"Nanda Fifia Putri","role":"Komisaris","body":"Nanda Fifia Putri membawa perspektif yang halus ke dalam jajaran AKARRA, dengan keahlian dalam warisan brand dan tata kelola filantropi. Kariernya dibentuk oleh titik temu antara dunia budaya tinggi dan keuangan tingkat atas, memastikan produk dan layanan AKARRA tetap menjaga jiwanya seiring pertumbuhan skala bisnis.","portrait":"\\/storage\\/settings\\/2026\\/08\\/b4PClzlPHjsjNyvl7a6gptYZ.jpg","quote":"Kepemimpinan visioner adalah tentang melihat benang-benang tak kasat mata yang menghubungkan keputusan hari ini dengan warisan hari esok.","legacy_body":"Filosofi Nanda berakar pada 'Cultural Capital.' Ia menjunjung pelestarian nilai (values) yang berjalan seiring dengan nilai ekonomi (value), memastikan brand AKARRA menjadi penanda prestise dan kedalaman intelektual bagi generasi mendatang."}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8504-7354-ab42-5bfdb3e8cbe4	founders	quote	Fondasi yang dibangun di atas integritas, masa depan yang dibentuk oleh visi.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-842c-7147-94a4-ca4012ad99da	global	nav_cta_label	Mulai Percakapan	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8429-7122-b93d-0323932dff65	global	nav	[{"label":"Ekosistem","path":"\\/ecosystem"},{"label":"Produk","path":"\\/products"},{"label":"Layanan","path":"\\/services"},{"label":"Artikel","path":"\\/articles"},{"label":"Pendiri","path":"\\/founders"}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8522-7010-a964-87b06004f0a3	global	social	[{"platform":"instagram","url":null,"label":"Instagram"},{"platform":"tiktok","url":null,"label":"TikTok"},{"platform":"linkedin","url":null,"label":"LinkedIn"}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	en
01a01ab9-847b-71e6-b2dd-063e69c9c412	home	founders_title	Kenali Para Pendiri	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8444-71d0-be19-b73893f13d3b	home	hero_cta_label	Jelajahi Ekosistem	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8437-70ad-87b2-b3af6500128c	home	hero_eyebrow	Warisan yang Sedang Dibangun	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8447-73c6-91b4-a4c89736fbab	home	hero_secondary_cta_label	Filosofi Kami	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8441-7284-b8c5-7a403fb8826c	home	hero_subtitle	Perpaduan yang canggih antara semangat Fashionpreneur, inovasi Creative Labs, dan keunggulan strategi periklanan. AKARRA dibangun untuk para visioner masa depan.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8540-7095-95f1-152bf0ef6bf8	home	narrative_image	/storage/settings/2026/08/SfSZs6tS73hCToZkz6pPVDPu.png	string	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-8452-71bf-a297-a50e8c4b61d3	home	narrative_image	/storage/settings/2026/08/SfSZs6tS73hCToZkz6pPVDPu.png	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8459-70a5-8998-917402cffced	home	narrative_quote_attribution	Para Pendiri AKARRA	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8455-72fa-b9c7-084da9019060	home	narrative_quote	Kami percaya bahwa prestise sejati lahir dari titik temu antara presisi yang terukur dan jiwa seni. Perjalanan kami adalah tentang menciptakan dampak yang bergema lintas generasi.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8462-7320-8979-8482fca9c672	home	services_eyebrow	Tiga Pilar Kami	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8465-7057-bdf0-6b2accf76e4b	home	services_title	Ekosistem Layanan	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-846c-7355-9ac1-b56ad4e4d17b	home	solutions_title	Solusi Pilihan	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-855c-7167-9954-7594ae701b8c	home	solutions	[{"title":"Bespoke Collection","body":"Made-to-measure excellence for the modern executive.","image":"\\/storage\\/settings\\/2026\\/08\\/yeHZ8rf20mBBMcjVcUYJQnoT.png","category":"Fashion"},{"title":"Signature Textiles","body":"Ethically sourced, world-class fabric curation.","image":"\\/storage\\/settings\\/2026\\/08\\/lLRJ4k0eWg9xGuXF1TQXLdB7.png","category":"Fashion"},{"title":"Visual Storytelling","body":"Narasi visual yang membangun kedekatan emosional dengan audiens.","image":"\\/storage\\/settings\\/2026\\/08\\/iIocgYCA8koGjMc61MRDmhJq.jpg","category":"Creative"},{"title":"Brand Positioning","body":"Strategi penempatan brand yang tajam dan terukur di pasar digital.","image":"\\/storage\\/settings\\/2026\\/08\\/DpSmLgRL2OnKU2gEV2nx0B6G.jpg","category":"Advertising"}]	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-851c-7375-bcc5-fd118e21c849	global	whatsapp	6285179973943	string	2026-08-19 15:52:40	2026-08-24 10:36:08	en
01a01ab9-8470-7345-85ee-f8a4d44f11a8	home	solutions	[{"title":"Bespoke Collection","body":"Keunggulan yang dijahit khusus untuk eksekutif masa kini.","image":"\\/storage\\/settings\\/2026\\/08\\/yeHZ8rf20mBBMcjVcUYJQnoT.png","category":"Fesyen"},{"title":"Signature Textiles","body":"Kurasi kain kelas dunia dengan sumber yang beretika.","image":"\\/storage\\/settings\\/2026\\/08\\/lLRJ4k0eWg9xGuXF1TQXLdB7.png","category":"Fesyen"},{"title":"Visual Storytelling","body":"Narasi visual yang membangun kedekatan emosional dengan audiens.","image":"\\/storage\\/settings\\/2026\\/08\\/iIocgYCA8koGjMc61MRDmhJq.jpg","category":"Kreatif"},{"title":"Brand Positioning","body":"Strategi penempatan brand yang tajam dan terukur di pasar digital.","image":"\\/storage\\/settings\\/2026\\/08\\/DpSmLgRL2OnKU2gEV2nx0B6G.jpg","category":"Periklanan"}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8566-730d-a905-447acd425001	home	story_video	/storage/settings/2026/08/O09gkXdYgLQYheejYBLGGK1j.mp4	string	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-8479-72a9-8121-f7b08aba2c9c	home	story_video	/storage/settings/2026/08/O09gkXdYgLQYheejYBLGGK1j.mp4	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-8460-7032-8c03-145ab837f959	home	values	[{"name":"Excellence","body":"Kualitas tanpa kompromi di setiap jahitan, bingkai, dan strategi yang kami kerjakan."},{"name":"Integrity","body":"Membangun kepercayaan melalui transparansi dan kepemimpinan yang beretika di setiap lini."},{"name":"Innovation","body":"Menembus batas melalui eksperimen kreatif dan teknologi modern."},{"name":"Elegance","body":"Komitmen pada estetika yang halus, berbicara tanpa perlu berteriak."}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84d3-73d2-b14e-81b9b139185e	products	cta_label	Ajukan Audit	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84d5-7249-aeb9-41a1d60401db	products	cta_secondary_label	Gabung Daftar Tunggu	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84d0-71dc-8bd3-149fd26f0401	products	cta_subtitle	Model kerja sama klien terbatas kami memastikan setiap kemitraan mendapatkan perhatian penuh dari seluruh kekuatan strategi dan kreativitas AKARRA.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84cd-739d-9f82-263798024f60	products	cta_title	Siap mendefinisikan ulang standar Anda?	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84cb-7319-b183-b243fa2f74b3	products	digital_items	[{"title":"Penguasaan Omnichannel","body":"Mengintegrasikan narasi brand secara mulus di lebih dari 12 titik sentuh untuk pengalaman pengguna yang menyatu dan eksklusif."},{"title":"Narasi Berbasis Data","body":"Memanfaatkan algoritma eksklusif untuk memprediksi pergeseran budaya dan memposisikan brand selangkah lebih maju."},{"title":"Visual Berkonversi Tinggi","body":"Standar produksi sinematik yang diterapkan pada iklan programatik demi prestise dan ROI maksimal."}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84c6-72f6-b96c-c330ce35c8d9	products	digital_title	Dominasi Strategis di Ranah Digital	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84ad-73d8-aeda-dc3cad9484f9	products	hero_eyebrow	Koleksi Pilihan	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84b5-71f7-bb6e-99995038a943	products	hero_subtitle	Jelajahi ekosistem produk AKARRA, tempat logika berkinerja tinggi bertemu dengan keahlian tangan pengrajin. Solusi kami dirancang bagi mereka yang menuntut hasil tanpa kompromi.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85ae-70f8-92fb-f27afba260d9	products	items	[{"name":"The Meridian Suite","label":"Limited Release 01","image":"\\/storage\\/settings\\/2026\\/08\\/bxE2tNoKTtVC6ItTBzxn4YL4.jpg","tag":"Reserve"},{"name":"Artisanal Accents","label":"Fiber Innovation","image":"\\/storage\\/settings\\/2026\\/08\\/AQlxvtpd2H3HYj59vEfYsM7H.jpg","tag":"Explore"}]	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-84bb-7209-8ae8-deee6ffa7b35	products	items	[{"name":"The Meridian Suite","label":"Edisi Terbatas 01","image":"\\/storage\\/settings\\/2026\\/08\\/bxE2tNoKTtVC6ItTBzxn4YL4.jpg","tag":"Reservasi"},{"name":"Artisanal Accents","label":"Inovasi Serat","image":"\\/storage\\/settings\\/2026\\/08\\/AQlxvtpd2H3HYj59vEfYsM7H.jpg","tag":"Jelajahi"}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84c1-708d-a29a-49aa6e2b2591	products	labs	[{"title":"Material Bio-Synthesis","body":"Mengembangkan alternatif berkelanjutan hasil rekayasa laboratorium untuk material langka pada interior mewah."},{"title":"Cognitive Branding","body":"Sebuah metodologi untuk membangun resonansi brand melalui prinsip neuro-estetika dan pemetaan sensorik."}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84b8-7112-b199-678349e246f4	products	textile_body	Busana yang dijahit dengan presisi, mendefinisikan ulang identitas kalangan atas melalui serat langka dan siluet arsitektural.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84b7-73f2-9619-4dfbf5c33173	products	textile_title	Rekayasa Tekstil & Fashion	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85b7-7389-a2e2-5f2f3d5935ab	products	whitepaper	{"label":"Experimental Case 042","title":"Spatial Intelligence","body":"Revolutionizing human-interface interaction through biological feedback loops and predictive spatial modeling.","image":"\\/storage\\/settings\\/2026\\/08\\/dxj38e4VTYWGKRZ0aKd43PXW.jpg"}	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-84c4-729e-af3c-e184d4856710	products	whitepaper	{"label":"Studi Eksperimental 042","title":"Kecerdasan Spasial","body":"Merevolusi interaksi antarmuka manusia melalui umpan balik biologis dan pemodelan spasial prediktif.","image":"\\/storage\\/settings\\/2026\\/08\\/dxj38e4VTYWGKRZ0aKd43PXW.jpg"}	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84ec-7154-99e6-d831ce2d8294	services	amplification_cards	[{"title":"Strategi Digital","body":"Analisis pasar menyeluruh dan pemetaan pertumbuhan untuk sektor premium.","bullets":["Intelijen Pasar","Optimalisasi Funnel"]},{"title":"Produksi Konten","body":"Video kelas atas, fotografi editorial, dan penceritaan interaktif.","bullets":["Video Editorial 4K","Narasi Sosial"]},{"title":"Pertumbuhan Brand","body":"Kemitraan strategis, seeding influencer, dan ekspansi global.","bullets":["PR Strategis","Ekspansi Lintas Negara"]}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84f2-72ee-9cc9-15a96ffb5e53	services	cta_title	Siap mendefinisikan ulang warisan Anda?	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85d8-733b-8518-356b0203711a	services	gallery	["\\/storage\\/settings\\/2026\\/08\\/15S2qzNfOwfnNX2FqrqQmop3.jpg","\\/storage\\/settings\\/2026\\/08\\/tGVY3wT9vkQ6gOA7kJnFzBIS.jpg","\\/storage\\/settings\\/2026\\/08\\/hWNqawPpqeMESVJsTj7VSBAq.jpg","\\/storage\\/settings\\/2026\\/08\\/WwTwqEVaNKZqCmIi2OOzix4V.jpg","\\/storage\\/settings\\/2026\\/08\\/788q1kioDA3Q5cM5o2IJW4jW.jpg"]	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-84e4-72b9-8655-1ba73ad68804	services	gallery	["\\/storage\\/settings\\/2026\\/08\\/15S2qzNfOwfnNX2FqrqQmop3.jpg","\\/storage\\/settings\\/2026\\/08\\/tGVY3wT9vkQ6gOA7kJnFzBIS.jpg","\\/storage\\/settings\\/2026\\/08\\/hWNqawPpqeMESVJsTj7VSBAq.jpg","\\/storage\\/settings\\/2026\\/08\\/WwTwqEVaNKZqCmIi2OOzix4V.jpg","\\/storage\\/settings\\/2026\\/08\\/788q1kioDA3Q5cM5o2IJW4jW.jpg"]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84e9-73d7-85a4-6921e5ecfec5	services	growth_body	Presisi berbasis data bertemu intuisi kreatif. Kami tidak sekadar menemukan audiens Anda; kami menumbuhkan komunitas pendukung setia.	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84e6-726f-a10c-695630f1b725	services	growth_title	Strategi & Pertumbuhan Digital	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-84df-702a-a0d8-e363ff9dc231	services	hero_eyebrow	Kapabilitas Kami	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85d0-7160-bc33-fb5cb85411eb	services	hero_image	/storage/settings/2026/08/3WguMOu63aDaYTYLxhcGFkPx.jpg	string	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-84dd-701f-b874-edd158c3082e	services	hero_image	/storage/settings/2026/08/3WguMOu63aDaYTYLxhcGFkPx.jpg	string	2026-08-19 15:52:40	2026-08-24 09:43:39	id
01a01ab9-85d6-71f7-b10f-9ebda865cc07	services	pillars	[{"name":"Fashionpreneur","label":"Infrastructure","body":"A comprehensive ecosystem for established designers and emerging labels to scale with integrity. We handle the complexities of the supply chain so you can focus on the soul of the brand.","items":["Industri Pakaian Jadi","Perdagangan Besar Pakaian","Distribusi & Retail"],"bullets":["Brand Development","Textile Sourcing","Atelier Manufacturing","Distribution Strategy"],"subcards":[{"title":"The Atelier","body":"Bespoke sample making and technical pattern drafting for high-fashion silhouettes.","bullets":["Haute Couture Sampling","Tech Pack Development"]},{"title":"Global Production","body":"Ethical, small-batch manufacturing and large-scale textile sourcing with a focus on sustainability.","bullets":["Ethical Sourcing","QC Management"]}],"image":"\\/storage\\/settings\\/2026\\/08\\/kfzsveKx21tROaS71YF8LIcS.jpg"},{"name":"Creative Labs","label":"Identity","body":"The intellectual engine of AKARRA. We translate brand ethos into visual and experiential narratives that resonate with a discerning global audience.","items":["Desain Grafis & Branding","Produksi Konten","Event & Pertunjukan"],"bullets":["Visual Storytelling","UI\\/UX Innovation","Photography & Cinema","Experimental Design"],"subcards":[{"title":"Art Direction","body":"Curation of visual identity, campaign imagery, and high-fidelity brand guidelines.","bullets":["Visual Strategy","Identity Design"]},{"title":"Immersive Events","body":"Bespoke product launches and runway shows designed to evoke emotional intelligence.","bullets":["Spatial Design","Guest Curation"]}],"image":"\\/storage\\/settings\\/2026\\/08\\/HcA1NG2lhTyuIJuMyYpAEQzA.jpg"},{"name":"Advertising","label":"Periklanan & Strategi Digital","body":"Strategi digital dan periklanan inovatif untuk memperkuat posisi brand di pasar.","items":["Strategi Digital","Media Placement","Social Media Management"],"bullets":["Brand Positioning","Market Penetration","Digital Growth","Strategic Media"],"image":null}]	json	2026-08-19 15:52:41	2026-08-24 09:43:39	en
01a01ab9-84e1-7224-80b2-867033ac6d69	services	pillars	[{"name":"Fashionpreneur","label":"Infrastruktur","body":"Ekosistem menyeluruh bagi desainer mapan maupun label baru untuk tumbuh dengan tetap menjaga integritas. Kami menangani kerumitan rantai pasok agar Anda bisa fokus pada jiwa brand Anda.","items":["Industri Pakaian Jadi","Perdagangan Besar Pakaian","Distribusi & Retail"],"bullets":["Pengembangan Brand","Sumber Tekstil","Produksi Atelier","Strategi Distribusi"],"subcards":[{"title":"The Atelier","body":"Pembuatan sampel khusus dan penggambaran pola teknis untuk siluet mode tingkat tinggi.","bullets":["Sampling Haute Couture","Pengembangan Tech Pack"]},{"title":"Global Production","body":"Produksi skala kecil yang beretika dan pengadaan tekstil skala besar dengan fokus pada keberlanjutan.","bullets":["Sumber yang Etis","Manajemen Kendali Mutu"]}],"image":"\\/storage\\/settings\\/2026\\/08\\/kfzsveKx21tROaS71YF8LIcS.jpg"},{"name":"Creative Labs","label":"Identitas","body":"Mesin intelektual AKARRA. Kami menerjemahkan jiwa brand menjadi narasi visual dan pengalaman yang bergema di hadapan audiens global yang jeli.","items":["Desain Grafis & Branding","Produksi Konten","Event & Pertunjukan"],"bullets":["Narasi Visual","Inovasi UI\\/UX","Fotografi & Sinema","Desain Eksperimental"],"subcards":[{"title":"Art Direction","body":"Kurasi identitas visual, citra kampanye, dan pedoman brand dengan standar tinggi.","bullets":["Strategi Visual","Desain Identitas"]},{"title":"Immersive Events","body":"Peluncuran produk dan gelaran runway yang dirancang khusus untuk membangkitkan kecerdasan emosional.","bullets":["Desain Ruang","Kurasi Tamu"]}],"image":"\\/storage\\/settings\\/2026\\/08\\/HcA1NG2lhTyuIJuMyYpAEQzA.jpg"},{"name":"Advertising","label":"Periklanan & Strategi Digital","body":"Strategi digital dan periklanan inovatif untuk memperkuat posisi brand di pasar.","items":["Strategi Digital","Media Placement","Social Media Management"],"bullets":["Positioning Brand","Penetrasi Pasar","Pertumbuhan Digital","Media Strategis"],"image":null}]	json	2026-08-19 15:52:40	2026-08-24 09:43:39	id
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified_at, password, role, remember_token, created_at, updated_at) FROM stdin;
01a01ab9-83e3-71dd-b6e0-f1bf9a2b68b5	Admin AKARRA	admin@akarra.co.id	\N	$2y$12$exuYAwFW/TGa.nR.s/rqYeAshR4ZNRu1bPHzJUPD4qt/c7KqKY8Zy	admin	\N	2026-08-19 15:52:40	2026-08-21 14:58:53
\.


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 9, true);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_unique UNIQUE (slug);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: categories categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_unique UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: settings settings_group_key_locale_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_group_key_locale_unique UNIQUE ("group", key, locale);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: articles_status_published_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX articles_status_published_at_index ON public.articles USING btree (status, published_at);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: contacts_interest_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contacts_interest_index ON public.contacts USING btree (interest);


--
-- Name: contacts_is_read_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contacts_is_read_index ON public.contacts USING btree (is_read);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: settings_group_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_group_index ON public.settings USING btree ("group");


--
-- Name: users_role_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_index ON public.users USING btree (role);


--
-- Name: articles articles_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- Name: articles articles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 7OdjjxgsVyvKltBbjZmKxMWRJvkA7L1z8Wuc2wMiOKoYFhZt0YE4FindafaT2cs

