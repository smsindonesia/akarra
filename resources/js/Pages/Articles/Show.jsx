import { Head, Link } from '@inertiajs/react'

import Display from '../../components/atoms/Display'
import Eyebrow from '../../components/atoms/Eyebrow'
import Figure from '../../components/atoms/Figure'
import Paragraph from '../../components/atoms/Paragraph'
import PublicLayout from '../../Layouts/PublicLayout'
import { useLanguage } from '../../context/LanguageContext'
import { useContent } from '../../hooks/useContent'

export default function ArticleShow({ article, related, canonicalUrl, coverImageUrl }) {
  const { t } = useLanguage()
  const { get } = useContent()

  const title = article.meta_title || article.title
  const description = article.meta_description || article.excerpt || ''
  const siteName = get('global', 'site_name', 'AKARRA')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    ...(coverImageUrl && { image: [coverImageUrl] }),
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    ...(article.author && { author: { '@type': 'Person', name: article.author.name } }),
    publisher: { '@type': 'Organization', name: siteName },
  }

  return (
    <>
      <Head title={title}>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteName} />
        {coverImageUrl && <meta property="og:image" content={coverImageUrl} />}
        {article.published_at && <meta property="article:published_time" content={article.published_at} />}
        {article.category && <meta property="article:section" content={article.category.name} />}
        {article.author && <meta property="article:author" content={article.author.name} />}

        <meta name="twitter:card" content={coverImageUrl ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {coverImageUrl && <meta name="twitter:image" content={coverImageUrl} />}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <article className="pt-40 pb-20 md:pt-48">
        <div className="shell mx-auto max-w-3xl">
          {article.category && <Eyebrow>{article.category.name}</Eyebrow>}

          <Display as="h1" size="xl" className="mt-5">
            {article.title}
          </Display>

          <p className="mt-6 text-[13px] uppercase tracking-[0.14em] text-muted">
            {article.published_at_human}
            {article.author && ` · ${article.author.name}`}
            {' · '}
            {article.reading_time} {t('articleMinRead')}
          </p>
        </div>

        {article.cover_image && (
          <div className="shell mt-14 max-w-3xl">
            <Figure src={article.cover_image} alt={article.title} ratio="aspect-[16/9]" />
          </div>
        )}

        <div
          className="shell prose prose-neutral mx-auto mt-14 max-w-3xl text-[17px] leading-[1.9] text-ink/80 [&_a]:text-gold [&_h2]:font-display [&_h2]:font-light [&_h3]:font-display [&_h3]:font-light"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {related.length > 0 && (
          <div className="shell mt-24 max-w-3xl border-t border-ink/10 pt-14">
            <h2 className="font-display text-2xl font-light">{t('articleRelated')}</h2>

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
              &larr; {t('articleBackToList')}
            </Link>
          </Paragraph>
        </div>
      </article>
    </>
  )
}

ArticleShow.layout = (page) => <PublicLayout>{page}</PublicLayout>
