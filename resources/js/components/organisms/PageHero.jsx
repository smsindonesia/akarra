import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Eyebrow from '../atoms/Eyebrow'
import Figure from '../atoms/Figure'
import MandalaMark from '../atoms/MandalaMark'
import Paragraph from '../atoms/Paragraph'

/**
 * Hero yang dipakai kelima halaman.
 *
 * `variant="landing"` untuk beranda (rata kiri, tinggi penuh);
 * `variant="page"` untuk halaman dalam (rata tengah, lebih ringkas).
 */
export default function PageHero({
  eyebrow,
  title,
  emphasis,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaVariant = 'solid',
  secondaryCtaLabel,
  secondaryCtaTo,
  image,
  variant = 'page',
  divider = false,
}) {
  const isLanding = variant === 'landing'
  // Tinggi penuh layar hanya masuk akal kalau ada foto di bawahnya yang perlu
  // didorong keluar layar pertama (lihat blok `image` di bawah) — tanpa itu,
  // halaman tanpa foto (Ecosystem/Products/Founders) jadi terasa kosong kalau
  // dipaksa penuh satu layar juga.
  const hasTrailingImage = Boolean(image) && !isLanding

  return (
    <section
      className={`relative overflow-hidden ${
        isLanding ? 'flex min-h-[clamp(560px,88vh,880px)] items-center pt-24' : 'pb-20 md:pb-28'
      }`}
    >
      {/* Motif mandala di latar, sangat samar. Salah satu dari empat tempat
          motif ini boleh muncul. */}
      <MandalaMark className="animate-drift pointer-events-none absolute -right-24 top-1/4 h-[34rem] w-[34rem] opacity-[0.055] md:-right-16" />

      {isLanding && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[-8rem] top-[-4rem] hidden h-[32rem] w-[32rem] origin-top-left rotate-45 border border-line/60 md:block"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[-10rem] top-[-8rem] hidden h-[32rem] w-[32rem] origin-top-left rotate-[30deg] border border-line/40 md:block"
          />
        </>
      )}

      <div
        className={`shell relative ${
          isLanding
            ? ''
            : hasTrailingImage
              ? 'flex min-h-screen items-center justify-center pt-24 text-center'
              : 'flex min-h-[clamp(420px,58vh,620px)] items-center justify-center pt-24 text-center'
        }`}
      >
        <div className={isLanding ? 'max-w-3xl' : 'mx-auto max-w-3xl'}>
          {eyebrow && (
            <div className="animate-fade-up">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}

          <Display
            as="h1"
            size="hero"
            emphasis={emphasis}
            className={`animate-fade-up ${eyebrow ? 'mt-6' : ''}`}
          >
            {title}
          </Display>

          {/* Garis emas yang menyapu setelah judul muncul. Satu gerakan kecil
              yang menandai selesainya pembukaan halaman. */}
          <span
            className={`animate-sweep mt-8 block h-px w-24 bg-gold ${isLanding ? '' : 'mx-auto'}`}
            aria-hidden="true"
          />

          {subtitle && (
            <Paragraph
              className={`animate-fade-up measure mt-8 ${isLanding ? '' : 'mx-auto'}`}
              style={{ animationDelay: '150ms' }}
            >
              {subtitle}
            </Paragraph>
          )}

          {ctaLabel && (
            <div className={`animate-fade-up mt-12 flex flex-wrap gap-6 ${isLanding ? '' : 'justify-center'}`}>
              <Button to={ctaTo ?? '/#kolaborasi'} variant={ctaVariant}>
                {ctaLabel}
              </Button>

              {secondaryCtaLabel && (
                <Button to={secondaryCtaTo ?? '/#kolaborasi'} variant="outlineMuted">
                  {secondaryCtaLabel}
                </Button>
              )}
            </div>
          )}

          {divider && !ctaLabel && (
            <span className="mx-auto mt-10 block h-16 w-px bg-line" aria-hidden="true" />
          )}
        </div>
      </div>

      {image && !isLanding && (
        <div className="mt-12 md:mt-16">
          <Figure src={image} alt={title} ratio="aspect-[16/9]" className="min-h-[260px] max-h-[70vh]" />
        </div>
      )}
    </section>
  )
}
