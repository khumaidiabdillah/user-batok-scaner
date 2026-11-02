'use server'

import { cookies } from 'next/headers'
import { supabaseUserDB } from '@/lib/supabase'
import { uploadScanImage } from '@/lib/storage'

interface ScanSubmitResult {
  success?: boolean
  error?: string
}

export async function submitScanAction(
  _prevState: ScanSubmitResult | null,
  formData: FormData
): Promise<ScanSubmitResult> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('employee_session')

  if (!sessionCookie?.value) {
    return { error: 'Sesi tidak valid. Silakan login ulang.' }
  }

  let employee: {
    id: string
    nik: string
    nama_lengkap: string
    tim_divisi: string
    no_hp: string
  }

  try {
    employee = JSON.parse(sessionCookie.value)
  } catch {
    return { error: 'Sesi tidak valid. Silakan login ulang.' }
  }

  const fotoBase64 = formData.get('foto') as string
  const shift = formData.get('shift') as string
  const catatan = formData.get('catatan') as string

  if (!fotoBase64) {
    return { error: 'Foto catatan diperlukan.' }
  }

  if (!shift || !['Pagi', 'Siang', 'Malam'].includes(shift)) {
    return { error: 'Pilih shift yang valid.' }
  }

  try {
    // Upload gambar ke Supabase Storage Bucket 'batok-scans'
    const storedImageUrl = await uploadScanImage(fotoBase64, employee.nik)

    const { error } = await supabaseUserDB
      .from('work_scans')
      .insert({
        employee_id: employee.id,
        nama_karyawan: employee.nama_lengkap,
        tim_divisi: employee.tim_divisi,
        foto_catatan_url: storedImageUrl,
        shift: shift,
        catatan_tambahan: catatan || null,
        status_acc: 'Menunggu ACC',
        nominal_disetujui: null,
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return { error: 'Gagal menyimpan data. Coba lagi.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Submit scan error:', err)
    return { error: 'Terjadi kesalahan server. Coba lagi.' }
  }
}
