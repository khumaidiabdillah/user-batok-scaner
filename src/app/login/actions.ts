'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseUserDB } from '@/lib/supabase'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const nik = formData.get('nik') as string
  const pin = formData.get('pin') as string

  if (!nik || !pin) {
    return { error: 'NIK dan PIN harus diisi.' }
  }

  if (pin.length < 4 || pin.length > 6) {
    return { error: 'PIN harus 4-6 digit.' }
  }

  try {
    const { data: employee, error } = await supabaseUserDB
      .from('employees')
      .select('*')
      .eq('nik', nik.trim())
      .eq('pin_login', pin.trim())
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Supabase employee login error:', error)
      return { error: `Gagal query: ${error.message}` }
    }

    if (!employee) {
      return { error: 'NIK atau PIN salah, atau akun belum terdaftar.' }
    }

    const cookieStore = await cookies()
    cookieStore.set('employee_session', JSON.stringify({
      id: employee.id,
      nik: employee.nik,
      nama_lengkap: employee.nama_lengkap,
      tim_divisi: employee.tim_divisi,
      no_hp: employee.no_hp,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    })
  } catch {
    return { error: 'Terjadi kesalahan server. Coba lagi.' }
  }

  redirect('/beranda')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('employee_session')
  redirect('/login')
}
