import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseUserDB } from '@/lib/supabase'
import type { WorkScan } from '@/lib/types'
import BerandaClient from './beranda-client'

interface EmployeeSession {
  id: string
  nik: string
  nama_lengkap: string
  tim_divisi: string
  no_hp: string
}

export default async function BerandaPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('employee_session')

  if (!sessionCookie?.value) {
    redirect('/login')
  }

  let employee: EmployeeSession
  try {
    employee = JSON.parse(sessionCookie.value)
  } catch {
    redirect('/login')
  }

  // Get today's date range
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // Fetch today's work scans for this employee
  const { data: todayScans } = await supabaseUserDB
    .from('work_scans')
    .select('*')
    .eq('employee_id', employee.id)
    .gte('created_at', todayStart.toISOString())
    .lte('created_at', todayEnd.toISOString())
    .order('created_at', { ascending: false })

  // Fetch team members in the same divisi
  const { data: teamMembers } = await supabaseUserDB
    .from('employees')
    .select('id, nama_lengkap, nik, is_active')
    .eq('tim_divisi', employee.tim_divisi)
    .eq('is_active', true)
    .neq('id', employee.id)
    .order('nama_lengkap')

  // Fetch team members' scans for today to show status
  const teamMemberIds = teamMembers?.map((m) => m.id) || []
  let teamScansMap: Record<string, WorkScan[]> = {}

  if (teamMemberIds.length > 0) {
    const { data: teamScans } = await supabaseUserDB
      .from('work_scans')
      .select('*')
      .in('employee_id', teamMemberIds)
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString())

    if (teamScans) {
      teamScansMap = teamScans.reduce((acc: Record<string, WorkScan[]>, scan: WorkScan) => {
        if (!acc[scan.employee_id]) acc[scan.employee_id] = []
        acc[scan.employee_id].push(scan)
        return acc
      }, {})
    }
  }

  return (
    <BerandaClient
      employee={employee}
      todayScans={(todayScans as WorkScan[]) || []}
      teamMembers={teamMembers || []}
      teamScansMap={teamScansMap}
    />
  )
}
