import Display from '../atoms/Display'
import Eyebrow from '../atoms/Eyebrow'
import MandalaMark from '../atoms/MandalaMark'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

/**
 * Blok gelap. Di Figma, latar gelap selalu jatuh pada pernyataan besar —
 * visi global, strategi digital. Gelap dipakai sebagai penekanan, bukan
 * sebagai variasi. Maksimal dua per halaman di luar footer.
 *
 * `items` menampilkan daftar bernomor bila diberikan (misi, layanan).
 */
export default function StatementBlock({
  eyebrow,
  title,
  emphasis,
  body,
  items = [],
  children,
}) {
  const ref = useReveal()

  return (
    <section className="bg-ink text-ivory">
      <div ref={ref} className="reveal shell section">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div>
            {eyebrow && <Eyebrow tone="gold">{eyebrow}</Eyebrow>}

            <Display size="lg" emphasis={emphasis} className={`text-ivory ${eyebrow ? 'mt-5' : ''}`}>
              {title}
            </Display>
          </div>

          <div>
            {body && <Paragraph tone="invert" className="measure text-[17px] leading-[1.9]">{body}</Paragraph>}

            {items.length > 0 && (
              <ul className="mt-10 space-y-5">
                {items.map((item, index) => (
                  <li key={index} className="flex gap-5 border-t border-ivory/10 pt-5">
                    {/* Motif kecil sebagai penanda daftar — tempat keempat dan
                        terakhir motif mandala muncul di situs ini. */}
                    <MandalaMark
                      className="mt-1.5 h-3.5 w-3.5 shrink-0 text-gold"
                      strokeWidth={2.5}
                    />
                    <span className="text-[15px] leading-[1.85] text-ivory/75">
                      {typeof item === 'string' ? item : item.body ?? item.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
