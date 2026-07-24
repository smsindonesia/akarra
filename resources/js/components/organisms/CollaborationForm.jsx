import { useForm } from '@inertiajs/react'

import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Field, { fieldClass } from '../atoms/Field'
import MandalaMark from '../atoms/MandalaMark'
import Paragraph from '../atoms/Paragraph'
import SectionHead from '../molecules/SectionHead'
import { interestOptions } from '../../content/fallback'
import { useContent } from '../../hooks/useContent'
import useReveal from '../../hooks/useReveal'

/**
 * Formulir "Mari Berkolaborasi".
 *
 * Karena desain Figma tidak punya halaman kontak terpisah, komponen ini
 * dirancang sebagai organism mandiri yang bisa disisipkan di halaman mana pun.
 * Seluruh CTA di situs bermuara ke sini.
 */
export default function CollaborationForm() {
  const { get } = useContent()
  const ref = useReveal()

  const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    interest: '',
    subject: '',
    message: '',
    website: '',
  })

  const whatsapp = get('global', 'whatsapp')

  const onSubmit = (event) => {
    event.preventDefault()
    post('/contacts', { preserveScroll: true })
  }

  if (wasSuccessful) {
    return (
      <section id="kolaborasi" className="section bg-canvas scroll-mt-24">
        <div className="shell">
          <div className="mx-auto max-w-xl text-center">
            <MandalaMark className="mx-auto h-14 w-14 text-gold" strokeWidth={1.5} animated />

            <Display size="sm" className="mt-8">
              Pesan Anda terkirim.
            </Display>

            <Paragraph className="mt-5">
              Tim kami akan menghubungi Anda dalam 1×24 jam kerja.
            </Paragraph>

            <button
              type="button"
              onClick={() => reset()}
              className="mt-10 border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
            >
              Kirim pesan lain
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="kolaborasi" className="section bg-canvas scroll-mt-24">
      <div ref={ref} className="reveal shell">
        <SectionHead
          align="center"
          title={get('home', 'form_title', 'Mari Berkolaborasi')}
          body={get('home', 'form_subtitle')}
        />

        <form
          onSubmit={onSubmit}
          noValidate
          className="mx-auto mt-16 grid max-w-3xl gap-8 border border-line bg-canvas p-8 shadow-sm md:p-12"
        >
          {/* Honeypot. Tersembunyi dari manusia; bot cenderung mengisi semua
              field yang ada di DOM. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0"
            value={data.website}
            onChange={(e) => setData('website', e.target.value)}
          />

          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Nama lengkap" error={errors.name}>
              <input
                type="text"
                className={fieldClass}
                placeholder="Nama lengkap Anda"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
            </Field>

            <Field label="Alamat email" error={errors.email}>
              <input
                type="email"
                className={fieldClass}
                placeholder="nama@perusahaan.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Telepon (opsional)" error={errors.phone}>
              <input
                type="tel"
                className={fieldClass}
                placeholder="08xx"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
            </Field>

            <Field label="Layanan yang diminati" error={errors.interest}>
              <select
                className={fieldClass}
                value={data.interest}
                onChange={(e) => setData('interest', e.target.value)}
              >
                <option value="">Pilih satu</option>
                {interestOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Pesan Anda" error={errors.message}>
            <textarea
              rows={5}
              className={`${fieldClass} resize-none`}
              placeholder="Ceritakan apa yang sedang Anda bangun."
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
            />
          </Field>

          {whatsapp && Object.keys(errors).length > 0 && (
            <div role="alert" className="border-l-2 border-gold bg-sand px-5 py-4">
              <p className="text-[14px] text-ink/80">Periksa kembali isian di atas.</p>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-gold"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            <Button type="submit" variant="solid" disabled={processing} className="disabled:opacity-50">
              {processing ? 'Mengirim…' : get('home', 'form_cta_label', 'Kirim pesan')}
            </Button>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
              >
                Atau langsung lewat WhatsApp
              </a>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
