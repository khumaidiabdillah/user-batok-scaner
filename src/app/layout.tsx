import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portal Karyawan - PT Batok Kelapa',
  description: 'Portal karyawan untuk scan catatan hasil kerja harian',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="font-inter min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        {children}
      </body>
    </html>
  )
}
