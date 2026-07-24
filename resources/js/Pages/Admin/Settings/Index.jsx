import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import Button from '../../../components/atoms/Button'
import { fieldClass } from '../../../components/atoms/Field'
import AdminLayout from '../../../Layouts/AdminLayout'

const groupLabels = {
  global: 'Global',
  home: 'Beranda',
  ecosystem: 'Ecosystem',
  products: 'Products',
  services: 'Services',
  founders: 'Founders',
}

function classify(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'integer'
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return 'json'
  return 'string'
}

/** Membangun draft field-field yang bisa disunting untuk satu grup. */
function buildDraft(groupData) {
  const draft = {}

  Object.entries(groupData ?? {}).forEach(([key, value]) => {
    const type = classify(value)
    draft[key] = {
      type,
      value: type === 'json' ? JSON.stringify(value, null, 2) : value,
      error: null,
    }
  })

  return draft
}

function NewFieldForm({ onAdd }) {
  const [key, setKey] = useState('')
  const [type, setType] = useState('string')

  const submit = (event) => {
    event.preventDefault()
    if (!key.trim()) return

    const defaults = { string: '', integer: 0, boolean: false, json: '[]' }
    onAdd(key.trim(), type, defaults[type])
    setKey('')
    setType('string')
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 border-t border-ink/10 pt-6">
      <div>
        <span className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-muted">Field Baru</span>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="nama_field"
          className={`${fieldClass} w-56`}
        />
      </div>

      <select value={type} onChange={(e) => setType(e.target.value)} className={`${fieldClass} w-32`}>
        <option value="string">Teks</option>
        <option value="integer">Angka</option>
        <option value="boolean">Ya/Tidak</option>
        <option value="json">JSON</option>
      </select>

      <Button type="submit" variant="quiet">
        Tambah Field
      </Button>
    </form>
  )
}

export default function SettingsIndex({ settings, groups }) {
  const [activeGroup, setActiveGroup] = useState(groups[0])
  const [draft, setDraft] = useState(() => buildDraft(settings[groups[0]]))
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(null)
  const [saveError, setSaveError] = useState(false)

  const switchGroup = (group) => {
    setActiveGroup(group)
    setDraft(buildDraft(settings[group]))
    setSavedMessage(null)
  }

  const updateField = (key, patch) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  const addField = (key, type, value) => {
    setDraft((prev) => ({ ...prev, [key]: { type, value, error: null } }))
  }

  const handleSave = () => {
    const items = []
    let hasError = false

    Object.entries(draft).forEach(([key, field]) => {
      if (field.type !== 'json') {
        items.push({ group: activeGroup, key, value: field.value, type: field.type })
        return
      }

      try {
        const parsed = JSON.parse(field.value)
        items.push({ group: activeGroup, key, value: parsed, type: 'json' })
        updateField(key, { error: null })
      } catch {
        updateField(key, { error: 'JSON tidak valid.' })
        hasError = true
      }
    })

    if (hasError) return

    setSaving(true)
    setSavedMessage(null)
    setSaveError(false)

    router.put(
      '/admin/settings',
      { settings: items },
      {
        preserveScroll: true,
        onSuccess: () => setSavedMessage(`Perubahan grup ${groupLabels[activeGroup] ?? activeGroup} tersimpan.`),
        onError: () => setSaveError(true),
        onFinish: () => setSaving(false),
      },
    )
  }

  return (
    <div>
      <Head title="Pengaturan" />

      <h1 className="font-display text-3xl font-light text-ink">Pengaturan</h1>
      <p className="mt-2 text-[14px] text-muted">
        Konten setiap halaman publik. Perubahan langsung tayang setelah disimpan.
      </p>

      <div className="mt-8 flex flex-wrap gap-1 border-b border-ink/10">
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => switchGroup(group)}
            className={`px-4 py-3 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
              activeGroup === group ? 'border-b-2 border-gold text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {groupLabels[group] ?? group}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6">
        {Object.keys(draft).length === 0 && <p className="text-[14px] text-muted">Belum ada field pada grup ini.</p>}

        {Object.entries(draft).map(([key, field]) => (
          <div key={key}>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {key}
            </span>

            {field.type === 'boolean' && (
              <label className="flex items-center gap-2 text-[14px] text-ink">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => updateField(key, { value: e.target.checked })}
                  className="accent-gold"
                />
                Aktif
              </label>
            )}

            {field.type === 'integer' && (
              <input
                type="number"
                value={field.value}
                onChange={(e) => updateField(key, { value: Number(e.target.value) })}
                className={fieldClass}
              />
            )}

            {field.type === 'string' &&
              (String(field.value).length > 80 ? (
                <textarea
                  rows={3}
                  value={field.value}
                  onChange={(e) => updateField(key, { value: e.target.value })}
                  className={`${fieldClass} resize-none`}
                />
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateField(key, { value: e.target.value })}
                  className={fieldClass}
                />
              ))}

            {field.type === 'json' && (
              <textarea
                rows={8}
                value={field.value}
                onChange={(e) => updateField(key, { value: e.target.value })}
                spellCheck={false}
                className={`${fieldClass} font-mono text-[13px] resize-y`}
              />
            )}

            {field.error && <span className="mt-2 block text-[13px] text-gold">{field.error}</span>}
          </div>
        ))}

        <NewFieldForm onAdd={addField} />

        {savedMessage && (
          <div role="status" className="border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
            {savedMessage}
          </div>
        )}

        {saveError && (
          <div role="alert" className="border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
            Gagal menyimpan perubahan.
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="solid"
            onClick={handleSave}
            disabled={saving}
            className="disabled:opacity-50"
          >
            {saving ? 'Menyimpan…' : `Simpan ${groupLabels[activeGroup] ?? activeGroup}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

SettingsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
