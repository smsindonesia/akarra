import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'

import Badge from '../../../components/admin/Badge'
import Modal from '../../../components/admin/Modal'
import Button from '../../../components/atoms/Button'
import AdminLayout from '../../../Layouts/AdminLayout'
import { interestOptions } from '../../../content/fallback'

function ContactDetailModal({ contact, onClose }) {
  // Membuka detail otomatis menandainya sudah dibaca, seperti perilaku semula.
  useEffect(() => {
    if (!contact.is_read) {
      router.patch(`/admin/contacts/${contact.id}/read`, {}, { preserveScroll: true, preserveState: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact.id])

  const toggleRead = () => {
    router.patch(`/admin/contacts/${contact.id}/read`, {}, { preserveScroll: true })
  }

  const destroy = () => {
    router.delete(`/admin/contacts/${contact.id}`, { preserveScroll: true, onSuccess: onClose })
  }

  return (
    <Modal title="Detail Pesan" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4 text-[14px]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Nama</p>
            <p className="mt-1 text-ink">{contact.name}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Email</p>
            <p className="mt-1 text-ink">{contact.email}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Telepon</p>
            <p className="mt-1 text-ink">{contact.phone || 'Tidak ada'}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Minat</p>
            <p className="mt-1 text-ink">{contact.interest_label}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Subjek</p>
          <p className="mt-1 text-[14px] text-ink">{contact.subject || 'Tidak ada'}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Pesan</p>
          <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-ink/80">{contact.message}</p>
        </div>

        <p className="text-[12px] text-muted">Dikirim {contact.created_at_human}</p>

        <div className="flex justify-between border-t border-ink/10 pt-5">
          <button
            type="button"
            onClick={toggleRead}
            className="text-[11px] uppercase tracking-[0.1em] text-gold hover:underline"
          >
            Tandai {contact.is_read ? 'belum dibaca' : 'sudah dibaca'}
          </button>

          <button
            type="button"
            onClick={destroy}
            className="text-[11px] uppercase tracking-[0.1em] text-ink/50 hover:text-gold hover:underline"
          >
            Hapus pesan
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function ContactsIndex({ contacts, filters, unreadTotal }) {
  const [openContact, setOpenContact] = useState(null)

  const updateFilter = (key, value) => {
    router.get(
      '/admin/contacts',
      { ...filters, [key]: value === '' ? undefined : value, page: undefined },
      { preserveState: true, replace: true },
    )
  }

  const goToPage = (page) => {
    router.get('/admin/contacts', { ...filters, page }, { preserveState: true })
  }

  return (
    <div>
      <Head title="Pesan Masuk" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-light text-ink">
          Pesan Masuk
          {unreadTotal > 0 && (
            <span className="ml-3 align-middle">
              <Badge tone="gold">{unreadTotal} belum dibaca</Badge>
            </span>
          )}
        </h1>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          defaultValue={filters.search ?? ''}
          placeholder="Cari nama, email, subjek…"
          onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', e.currentTarget.value)}
          onBlur={(e) => updateFilter('search', e.currentTarget.value)}
          className="min-w-[220px] border-0 border-b border-ink/20 bg-transparent px-0 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        />

        <select
          value={filters.interest ?? ''}
          onChange={(e) => updateFilter('interest', e.target.value)}
          className="border-0 border-b border-ink/20 bg-transparent pl-0 pr-6 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Semua minat</option>
          {interestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.is_read ?? ''}
          onChange={(e) => updateFilter('is_read', e.target.value)}
          className="border-0 border-b border-ink/20 bg-transparent pl-0 pr-6 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Semua status</option>
          <option value="0">Belum dibaca</option>
          <option value="1">Sudah dibaca</option>
        </select>
      </div>

      <div className="mt-6">
        {contacts.data.length === 0 && <p className="text-[14px] text-muted">Tidak ada pesan.</p>}

        {contacts.data.length > 0 && (
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {contacts.data.map((contact) => (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => setOpenContact(contact)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left hover:bg-ivory"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[14px] text-ink">
                      {!contact.is_read && <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />}
                      <span className={contact.is_read ? 'font-normal' : 'font-medium'}>{contact.name}</span>
                      <span className="text-muted">({contact.interest_label})</span>
                    </p>
                    <p className="mt-1 truncate text-[13px] text-muted">{contact.subject || contact.message}</p>
                  </div>
                  <span className="shrink-0 text-[12px] text-muted">{contact.created_at_human}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {contacts.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between text-[13px] text-muted">
            <span>
              Halaman {contacts.current_page} dari {contacts.last_page}
            </span>
            <div className="flex gap-3">
              <Button
                variant="quiet"
                onClick={() => goToPage(contacts.current_page - 1)}
                disabled={contacts.current_page <= 1}
                className="disabled:opacity-30"
              >
                Sebelumnya
              </Button>
              <Button
                variant="quiet"
                onClick={() => goToPage(contacts.current_page + 1)}
                disabled={contacts.current_page >= contacts.last_page}
                className="disabled:opacity-30"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {openContact && <ContactDetailModal contact={openContact} onClose={() => setOpenContact(null)} />}
    </div>
  )
}

ContactsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
