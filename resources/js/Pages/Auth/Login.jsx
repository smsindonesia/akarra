import { Head, useForm } from '@inertiajs/react'

import Button from '../../components/atoms/Button'
import Field, { fieldClass } from '../../components/atoms/Field'
import MandalaMark from '../../components/atoms/MandalaMark'

export default function Login({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const onSubmit = (event) => {
    event.preventDefault()
    post('/admin/login')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6">
      <Head title="Masuk Admin" />

      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <MandalaMark className="h-12 w-12" animated />
          <h1 className="mt-6 font-display text-2xl font-light text-ink">Panel Admin AKARRA</h1>
          <p className="mt-2 text-[13px] text-muted">Masuk untuk mengelola konten situs.</p>
        </div>

        {status && (
          <div role="status" className="mb-6 border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
            {status}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="grid gap-6">
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              autoComplete="username"
              className={fieldClass}
              placeholder="nama@akarra.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
          </Field>

          <Field label="Kata Sandi" error={errors.password}>
            <input
              type="password"
              autoComplete="current-password"
              className={fieldClass}
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
          </Field>

          <label className="flex items-center gap-2 text-[13px] text-ink/70">
            <input
              type="checkbox"
              className="accent-gold"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            />
            Ingat saya
          </label>

          <Button type="submit" variant="solid" disabled={processing} className="w-full disabled:opacity-50">
            {processing ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  )
}
