import { Head, Link } from '@inertiajs/react'

import Display from '../../components/atoms/Display'
import Eyebrow from '../../components/atoms/Eyebrow'
import Figure from '../../components/atoms/Figure'
import Paragraph from '../../components/atoms/Paragraph'
import PublicLayout from '../../Layouts/PublicLayout'

export default function ArticleShow({ article, related }) {
  return (
    <>
      <Head title={article.meta_title || article.title}>
        <meta name="description" content={article.meta_description || article.excerpt || ''} />
      </Head>

      <article className="pt-40 pb-20 md:pt-48">
        <div className="shell mx-auto max-w-3xl">
          {article.category && <Eyebrow>{article.category.name}</Eyebrow>}

          <Display as="h1" size="xl" className="mt-5">
            {article.title}
          </Display>

          <p className="mt-6 text-[13px] uppercase tracking-[0.14em] text-muted">
            {article.published_at_human}
            {article.author && ` — ${article.author.name}`}
            {' — '}
            {article.reading_time} menit baca
          </p>
        </div>

        {article.cover_image && (
          <div className="shell mt-14 max-w-4xl">
            <Figure src={article.cover_image} alt={article.title} ratio="aspect-[16/9]" />
          </div>
        )}

        <div
          className="shell prose prose-neutral mx-auto mt-14 max-w-3xl text-[17px] leading-[1.9] text-ink/80 [&_a]:text-gold [&_h2]:font-display [&_h2]:font-light [&_h3]:font-display [&_h3]:font-light"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {related.length > 0 && (
          <div className="shell mt-24 max-w-3xl border-t border-ink/10 pt-14">
            <h2 className="font-display text-2xl font-light">Artikel terkait</h2>

            <ul className="mt-8 grid gap-6">
              {related.map((item) => (
                <li key={item.id}>
                  <Link href={`/articles/${item.slug}`} className="text-[15px] text-ink hover:text-gold">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="shell mt-14 max-w-3xl">
          <Paragraph>
            <Link href="/articles" className="border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] hover:border-gold hover:text-gold">
              &larr; Kembali ke Artikel
            </Link>
          </Paragraph>
        </div>
      </article>
    </>
  )
}

ArticleShow.layout = (page) => <PublicLayout>{page}</PublicLayout>
