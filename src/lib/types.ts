export interface Employee {
  id: string
  nik: string
  nama_lengkap: string
  tim_divisi: string
  no_hp: string
  pin_login: string
  is_active: boolean
  created_at: string
}

export interface WorkScan {
  id: string
  employee_id: string
  nama_karyawan: string
  tim_divisi: string
  foto_catatan_url: string
  shift: 'Pagi' | 'Siang' | 'Malam'
  catatan_tambahan: string | null
  status_acc: 'Menunggu ACC' | 'Disetujui' | 'Ditolak'
  nominal_disetujui: number | null
  created_at: string
}
