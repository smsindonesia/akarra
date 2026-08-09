import { Link } from '@inertiajs/react'

import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'
import SectionHead from '../molecules/SectionHead'
import useReveal from '../../hooks/useReveal'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Pratinjau tiga artikel terbaru di beranda, menaut ke /articles.
 * Markup kartu sengaja disamakan dengan Articles/Index.jsx agar konsisten
 * begitu pengunjung berpindah dari sini ke daftar artikel penuh.
 */
export default function ArticlesPreview({ articles = [] }) {
  const ref = useReveal()
  const { t } = useLanguage()

  if (articles.length === 0) return null

  return (
    <section className="section bg-canvas">
      <div className="shell">
        <SectionHead title={t('homeArticlesTitle')} align="center" eyebrow={t('homeArticlesEyebrow')} />

        <div ref={ref} className="reveal mt-16 grid gap-14 md:grid-cols-3 md:gap-12">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
              <Figure src={article.cover_image} alt={article.title} ratio="aspect-[4/3]" />

              {article.category && (
                <span className="mt-5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                  {article.category.name}
                </span>
              )}

              <Display as="h3" size="sm" className="mt-3 transition-colors group-hover:text-gold">
                {article.title}
              </Display>

              {article.excerpt && <Paragraph className="mt-3">{article.excerpt}</Paragraph>}
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button to="/articles" variant="quiet">
            {t('homeArticlesCta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
