import Display from '../atoms/Display'
import Eyebrow from '../atoms/Eyebrow'
import MandalaMark from '../atoms/MandalaMark'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

/**
 * Blok gelap (zinc-800). Di Figma, latar gelap selalu jatuh pada pernyataan
 * besar — visi global, strategi digital. Gelap dipakai sebagai penekanan,
 * bukan sebagai variasi. Maksimal dua per halaman di luar footer.
 *
 * `items` menampilkan daftar bila diberikan (misi, layanan). Default: motif
 * mandala kecil sebagai penanda. `numbered`: nomor ghost besar (01/02/03),
 * dipakai referensi pada daftar "Strategic Dominance"/"Digital Impact".
 */
export default function StatementBlock({
  eyebrow,
  title,
  emphasis,
  body,
  items = [],
  numbered = false,
  children,
}) {
  const ref = useReveal()

  return (
    <section className="bg-dark text-ivory">
      <div ref={ref} className="reveal shell section">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div>
            {eyebrow && <Eyebrow tone="invert">{eyebrow}</Eyebrow>}

            <Display size="lg" emphasis={emphasis} className={`text-ivory ${eyebrow ? 'mt-5' : ''}`}>
              {title}
            </Display>
          </div>

          <div>
            {body && <Paragraph tone="invert" className="measure text-[17px] leading-[1.9]">{body}</Paragraph>}

            {items.length > 0 && numbered && (
              <ol className="mt-10 space-y-8">
                {items.map((item, index) => (
                  <li key={index} className="flex gap-6">
                    <span className="font-display text-4xl font-normal leading-none text-accent-invert">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-display text-xl font-normal text-ivory">
                        {typeof item === 'string' ? item : item.title}
                      </p>
                      {typeof item === 'object' && item.body && (
                        <p className="mt-2 text-[14px] leading-[1.7] text-ivory-soft/80">{item.body}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {items.length > 0 && !numbered && (
              <ul className="mt-10 space-y-5">
                {items.map((item, index) => (
                  <li key={index} className="flex gap-5 border-t border-ivory/10 pt-5">
                    {/* Motif kecil sebagai penanda daftar — tempat keempat dan
                        terakhir motif mandala muncul di situs ini. */}
                    <MandalaMark
                      className="mt-1.5 h-3.5 w-3.5 shrink-0 text-accent-invert"
                      strokeWidth={2.5}
                    />
                    <span className="text-[15px] leading-[1.85] text-ivory-soft">
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
