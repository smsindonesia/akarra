import { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'

import Badge from '../../../components/admin/Badge'
import Spinner from '../../../components/admin/Spinner'
import Button from '../../../components/atoms/Button'
import Field, { fieldClass } from '../../../components/atoms/Field'
import AdminLayout from '../../../Layouts/AdminLayout'
import api from '../../../lib/api'

function TavilyCard() {
  const [status, setStatus] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  const [query, setQuery] = useState('')
  const [maxResults, setMaxResults] = useState(5)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const [failure, setFailure] = useState(null)

  useEffect(() => {
    api
      .get('/admin/tavily/status')
      .then(({ data }) => setStatus(data.data))
      .finally(() => setLoadingStatus(false))
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) return

    setSearching(true)
    setFailure(null)

    try {
      const { data } = await api.post('/admin/tavily/search', {
        query,
        max_results: Number(maxResults) || 5,
      })
      setResults(data.data?.results ?? [])
    } catch (error) {
      setFailure(error.response?.data?.message ?? 'Pencarian gagal. Coba lagi.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="border border-ink/10 bg-ivory p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-light text-ink">Tavily Search</h2>
          <p className="mt-1 text-[13px] text-muted">
            Mesin pencari web yang dipakai untuk riset konten dari dalam panel admin.
          </p>
        </div>

        {loadingStatus ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <Badge tone={status?.configured ? 'gold' : 'muted'}>
            {status?.configured ? 'Terhubung' : 'Belum Diatur'}
          </Badge>
        )}
      </div>

      {!loadingStatus && !status?.configured && (
        <p className="mt-5 border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
          TAVILY_API_KEY belum diatur di backend. Tambahkan kuncinya pada berkas <code>.env</code>, lalu
          muat ulang halaman ini.
        </p>
      )}

      {status?.configured && (
        <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <Field label="Kata Kunci">
            <input
              type="text"
              className={fieldClass}
              placeholder="Contoh: tren fashion Indonesia 2026"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>

          <Field label="Jumlah Hasil">
            <input
              type="number"
              min={1}
              max={20}
              className={`${fieldClass} w-24`}
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
            />
          </Field>

          <div className="flex items-end">
            <Button type="submit" variant="solid" disabled={searching} className="disabled:opacity-50">
              {searching ? 'Mencari…' : 'Cari'}
            </Button>
          </div>
        </form>
      )}

      {failure && <p className="mt-4 text-[13px] text-gold">{failure}</p>}

      {results.length > 0 && (
        <ul className="mt-6 grid gap-4 border-t border-ink/10 pt-6">
          {results.map((result) => (
            <li key={result.url} className="border-b border-ink/10 pb-4 last:border-b-0">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[14px] font-medium text-ink hover:text-gold"
              >
                {result.title}
              </a>
              <p className="mt-1 truncate text-[12px] text-muted">{result.url}</p>
              {result.content && (
                <p className="mt-2 text-[13px] leading-relaxed text-ink/70">{result.content.slice(0, 240)}…</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function IntegrationsIndex() {
  return (
    <div>
      <Head title="Integrasi" />

      <h1 className="font-display text-3xl font-light text-ink">Integrasi</h1>
      <p className="mt-2 text-[14px] text-muted">Layanan pihak ketiga yang terhubung dengan panel admin.</p>

      <div className="mt-8 grid gap-6">
        <TavilyCard />
      </div>
    </div>
  )
}

IntegrationsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
