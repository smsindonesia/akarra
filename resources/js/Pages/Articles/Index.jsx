import { Head, Link, router } from '@inertiajs/react'

import Display from '../../components/atoms/Display'
import Figure from '../../components/atoms/Figure'
import Paragraph from '../../components/atoms/Paragraph'
import PageHero from '../../components/organisms/PageHero'
import PublicLayout from '../../Layouts/PublicLayout'
import { useLanguage } from '../../context/LanguageContext'
import { useContent } from '../../hooks/useContent'

export default function ArticlesIndex({ articles, filters, canonicalUrl }) {
  const { get } = useContent()
  const { t } = useLanguage()

  const goToPage = (page) => {
    router.get('/articles', { ...filters, page }, { preserveScroll: true })
  }

  return (
    <>
      <Head title={`${t('articlesPageTitle')} | ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('global', 'description', '')} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <PageHero title={t('articlesPageTitle')} subtitle={t('articlesPageSubtitle')} />

      <section className="section pt-0">
        <div className="shell">
          {articles.data.length === 0 ? (
            <Paragraph tone="muted">{t('articlesEmpty')}</Paragraph>
          ) : (
            <div className="grid gap-14 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {articles.data.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                  <Figure src={article.cover_image} alt={article.title} ratio="aspect-[4/3]" />

                  {article.category && (
                    <span className="mt-5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                      {article.category.name}
                    </span>
                  )}

                  <Display as="h2" size="sm" className="mt-3 transition-colors group-hover:text-gold">
                    {article.title}
                  </Display>

                  {article.excerpt && <Paragraph className="mt-3">{article.excerpt}</Paragraph>}
                </Link>
              ))}
            </div>
          )}

          {articles.last_page > 1 && (
            <div className="mt-16 flex items-center justify-between text-[13px] text-muted">
              <span>
                {t('articlesPageOf')
                  .replace('{current}', articles.current_page)
                  .replace('{last}', articles.last_page)}
              </span>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => goToPage(articles.current_page - 1)}
                  disabled={articles.current_page <= 1}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] hover:text-gold disabled:opacity-30"
                >
                  {t('previous')}
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(articles.current_page + 1)}
                  disabled={articles.current_page >= articles.last_page}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] hover:text-gold disabled:opacity-30"
                >
                  {t('next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

ArticlesIndex.layout = (page) => <PublicLayout>{page}</PublicLayout>
