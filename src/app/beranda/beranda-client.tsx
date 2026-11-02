'use client'

import { useRouter } from 'next/navigation'
import {
  LogOut,
  Camera,
  User,
  Briefcase,
  Phone,
  Hash,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import type { WorkScan } from '@/lib/types'
import { logoutAction } from '@/app/login/actions'

interface EmployeeSession {
  id: string
  nik: string
  nama_lengkap: string
  tim_divisi: string
  no_hp: string
}

interface TeamMember {
  id: string
  nama_lengkap: string
  nik: string
  is_active: boolean
}

interface BerandaClientProps {
  employee: EmployeeSession
  todayScans: WorkScan[]
  teamMembers: TeamMember[]
  teamScansMap: Record<string, WorkScan[]>
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Disetujui':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-brand border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Disetujui
        </span>
      )
    case 'Ditolak':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3" />
          Ditolak
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 text-amber-brand border border-amber-200">
          <AlertCircle className="w-3 h-3" />
          Menunggu ACC
        </span>
      )
  }
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function BerandaClient({
  employee,
  todayScans,
  teamMembers,
  teamScansMap,
}: BerandaClientProps) {
  const router = useRouter()

  const firstName = employee.nama_lengkap.split(' ')[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#475569]">Selamat datang,</p>
            <h1 className="text-base font-semibold text-[#0F172A]">{firstName}</h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded-md hover:bg-[#F1F5F9] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-4">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Data Diri</h2>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <div>
                <p className="text-xs text-[#475569]">Nama Lengkap</p>
                <p className="text-sm font-medium text-[#0F172A]">{employee.nama_lengkap}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <div>
                <p className="text-xs text-[#475569]">NIK</p>
                <p className="text-sm font-medium text-[#0F172A] tabular-nums">{employee.nik}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <div>
                <p className="text-xs text-[#475569]">Tim / Divisi</p>
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-brand border border-emerald-200">
                  {employee.tim_divisi}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <div>
                <p className="text-xs text-[#475569]">No HP</p>
                <p className="text-sm font-medium text-[#0F172A] tabular-nums">{employee.no_hp}</p>
              </div>
            </div>
          </div>

          {/* Today Status */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#475569] mb-1">Status Hari Ini</p>
            {todayScans.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#0F172A]">{todayScans.length} setoran</span>
                <StatusBadge status={todayScans[0].status_acc} />
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">Belum ada setoran hari ini</p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/scan')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-brand text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <Camera className="w-5 h-5" />
          Scan Catatan Hasil Kerja
        </button>

        {/* Today's Scan History */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#475569]" />
            <h2 className="text-sm font-semibold text-[#0F172A]">Riwayat Setoran Hari Ini</h2>
          </div>

          {todayScans.length === 0 ? (
            <p className="text-sm text-[#94A3B8] text-center py-6">
              Belum ada setoran catatan hari ini.
            </p>
          ) : (
            <div className="space-y-2.5">
              {todayScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#0F172A] px-1.5 py-0.5 bg-white border border-[#E2E8F0] rounded">
                        Shift {scan.shift}
                      </span>
                      <span className="text-xs text-[#94A3B8] tabular-nums">
                        {formatTime(scan.created_at)}
                      </span>
                    </div>
                    {scan.catatan_tambahan && (
                      <p className="text-xs text-[#475569] mt-1 line-clamp-1">
                        {scan.catatan_tambahan}
                      </p>
                    )}
                    {scan.nominal_disetujui !== null && scan.status_acc === 'Disetujui' && (
                      <p className="text-xs font-medium text-emerald-brand mt-1 tabular-nums">
                        Rp {scan.nominal_disetujui.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={scan.status_acc} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#475569]" />
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Anggota Tim {employee.tim_divisi}
            </h2>
          </div>

          {teamMembers.length === 0 ? (
            <p className="text-sm text-[#94A3B8] text-center py-4">
              Tidak ada anggota tim lain.
            </p>
          ) : (
            <div className="space-y-2">
              {teamMembers.map((member) => {
                const memberScans = teamScansMap[member.id] || []
                const hasSubmitted = memberScans.length > 0
                const latestStatus = hasSubmitted ? memberScans[0]?.status_acc : null

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-2 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#E2E8F0] flex items-center justify-center">
                        <span className="text-xs font-medium text-[#475569]">
                          {member.nama_lengkap.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-[#0F172A]">{member.nama_lengkap}</span>
                    </div>
                    {hasSubmitted ? (
                      <StatusBadge status={latestStatus || 'Menunggu ACC'} />
                    ) : (
                      <span className="text-xs text-[#94A3B8]">Belum setor</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
