'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-brand text-white mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Portal Karyawan</h1>
          <p className="text-sm text-[#475569] mt-1">PT Batok Kelapa</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-6">
          <h2 className="text-base font-semibold text-[#0F172A] mb-5">Masuk ke Akun</h2>

          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="nik" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                NIK Karyawan
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                required
                autoComplete="username"
                placeholder="Masukkan NIK"
                className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-md bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand transition-colors"
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                PIN (6 Digit)
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                autoComplete="current-password"
                placeholder="••••••"
                className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-md bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand transition-colors tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-brand text-white text-sm font-medium rounded-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Hubungi admin jika lupa PIN atau akun terkunci.
        </p>
      </div>
    </div>
  )
}
