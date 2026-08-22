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
  const hasImage = Boolean(image) && !isLanding

  return (
    <section
      className={`relative overflow-hidden ${
        isLanding ? 'flex min-h-screen min-h-dvh items-center pt-24' : 'pb-20 md:pb-28'
      }`}
    >
      {/* Di mobile, foto jadi latar penuh di belakang teks (dengan scrim gelap
          untuk kontras) alih-alih strip terpisah di bawah — lebih berkesan
          daripada foto kecil yang berdiri sendiri. Desktop tetap memakai
          Figure terpisah di bawah teks (lihat akhir file). */}
      {hasImage && (
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/60" />
        </div>
      )}

      {/* Motif mandala di latar, sangat samar. Salah satu dari empat tempat
          motif ini boleh muncul. Hanya di beranda — halaman dalam tidak
          memakai latar sebesar ini. */}
      {isLanding && (
        <MandalaMark className="animate-drift pointer-events-none absolute -right-8 -top-16 h-[58rem] w-[58rem] opacity-[0.1] md:right-0" />
      )}

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
        className={`shell relative z-10 ${
          isLanding ? '' : 'flex min-h-screen min-h-dvh items-center justify-center pt-24 text-center'
        }`}
      >
        <div className={isLanding ? 'max-w-3xl' : 'mx-auto max-w-3xl'}>
          {eyebrow && (
            <div className="animate-fade-up">
              <Eyebrow tone={hasImage ? 'invert' : 'gold'} className={hasImage ? 'md:text-gold' : ''}>
                {eyebrow}
              </Eyebrow>
            </div>
          )}

          <Display
            as="h1"
            size="hero"
            emphasis={emphasis}
            className={`animate-fade-up ${eyebrow ? 'mt-6' : ''} ${hasImage ? 'text-ivory md:text-ink' : ''}`}
          >
            {title}
          </Display>

          {/* Garis emas yang menyapu setelah judul muncul. Satu gerakan kecil
              yang menandai selesainya pembukaan halaman. */}
          <span
            className={`animate-sweep mt-8 block h-px w-24 ${hasImage ? 'bg-accent-invert md:bg-gold' : 'bg-gold'} ${
              isLanding ? '' : 'mx-auto'
            }`}
            aria-hidden="true"
          />

          {subtitle && (
            <Paragraph
              tone={hasImage ? 'invert' : 'default'}
              className={`animate-fade-up measure mt-8 ${isLanding ? '' : 'mx-auto'} ${hasImage ? 'md:text-body' : ''}`}
              style={{ animationDelay: '150ms' }}
            >
              {subtitle}
            </Paragraph>
          )}

          {ctaLabel && (
            <div className={`animate-fade-up mt-12 flex flex-wrap gap-6 ${isLanding ? '' : 'justify-center'}`}>
              <Button to={ctaTo ?? `${route('home')}#kolaborasi`} variant={ctaVariant}>
                {ctaLabel}
              </Button>

              {secondaryCtaLabel && (
                <Button to={secondaryCtaTo ?? `${route('home')}#kolaborasi`} variant="outlineMuted">
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

      {hasImage && (
        <div className="mt-12 hidden md:mt-16 md:block">
          <Figure src={image} alt={title} ratio="aspect-[16/9]" className="mx-auto min-h-[260px] max-h-[70vh]" />
        </div>
      )}
    </section>
  )
}
