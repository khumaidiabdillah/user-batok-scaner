import { supabaseUserDB } from './supabase'

/**
 * Upload gambar (Base64 atau Buffer) ke Supabase Storage Bucket
 * dan mengembalikan Public URL yang siap disimpan di database.
 */
export async function uploadScanImage(
  base64Data: string,
  employeeNik: string
): Promise<string> {
  try {
    // Jika data berupa base64 (data:image/jpeg;base64,xxxx)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      // Jika sudah berupa URL biasa, langsung return
      if (base64Data.startsWith('http')) return base64Data
      throw new Error('Format gambar tidak valid')
    }

    const mimeType = matches[1]
    const base64Content = matches[2]
    const buffer = Buffer.from(base64Content, 'base64')

    const fileExt = mimeType.split('/')[1] || 'jpg'
    const fileName = `scan_${employeeNik}_${Date.now()}.${fileExt}`
    const filePath = `scans/${fileName}`

    // Upload ke bucket 'batok-scans' di DB_USER
    const { data, error } = await supabaseUserDB.storage
      .from('batok-scans')
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: true,
      })

    if (error) {
      console.warn('Storage upload error (fallback ke base64):', error.message)
      // Jika bucket belum dibuat di Supabase, fallback tetap gunakan data URL agar data tidak hilang
      return base64Data
    }

    // Dapatkan Public URL
    const { data: publicUrlData } = supabaseUserDB.storage
      .from('batok-scans')
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (err: any) {
    console.error('Catch in uploadScanImage:', err)
    return base64Data
  }
}
