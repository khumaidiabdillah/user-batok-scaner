'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Camera,
  RotateCcw,
  Send,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  VideoOff,
} from 'lucide-react'
import { submitScanAction } from './actions'

type CameraState = 'loading' | 'active' | 'error'
type PageState = 'camera' | 'preview' | 'submitting' | 'success'

export default function ScanPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<CameraState>('loading')
  const [cameraError, setCameraError] = useState<string>('')
  const [pageState, setPageState] = useState<PageState>('camera')
  const [capturedImage, setCapturedImage] = useState<string>('')
  const [shift, setShift] = useState<string>('Pagi')
  const [catatan, setCatatan] = useState<string>('')
  const [submitError, setSubmitError] = useState<string>('')

  const startCamera = useCallback(async () => {
    setCameraState('loading')
    setCameraError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraState('active')
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraState('error')

      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setCameraError('Akses kamera ditolak. Izinkan akses kamera di pengaturan browser.')
            break
          case 'NotFoundError':
            setCameraError('Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.')
            break
          case 'NotReadableError':
            setCameraError('Kamera sedang digunakan aplikasi lain.')
            break
          default:
            setCameraError('Gagal mengakses kamera. Coba lagi.')
        }
      } else {
        setCameraError('Gagal mengakses kamera. Coba lagi.')
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

    setCapturedImage(dataUrl)
    setPageState('preview')
    stopCamera()
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedImage('')
    setPageState('camera')
    setSubmitError('')
    startCamera()
  }, [startCamera])

  const handleSubmit = async () => {
    setPageState('submitting')
    setSubmitError('')

    const formData = new FormData()
    formData.set('foto', capturedImage)
    formData.set('shift', shift)
    formData.set('catatan', catatan)

    const result = await submitScanAction(null, formData)

    if (result?.error) {
      setSubmitError(result.error)
      setPageState('preview')
      return
    }

    if (result?.success) {
      setPageState('success')
      setTimeout(() => {
        router.push('/beranda')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/beranda')}
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#0F172A]">Scan Catatan</h1>
            <p className="text-xs text-[#475569]">Ambil foto catatan hasil kerja</p>
          </div>
        </div>
      </header>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Success State */}
      {pageState === 'success' && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-50 border border-emerald-200 mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-brand" />
            </div>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Berhasil Dikirim!</h2>
            <p className="text-sm text-[#475569]">Catatan kerja telah dikirim ke owner.</p>
            <p className="text-xs text-[#94A3B8] mt-2">Mengalihkan ke beranda...</p>
          </div>
        </div>
      )}

      {/* Camera View */}
      {(pageState === 'camera') && (
        <div className="flex-1 flex flex-col">
          {/* Camera Preview Area */}
          <div className="relative flex-1 bg-[#1E293B] flex items-center justify-center overflow-hidden">
            {cameraState === 'loading' && (
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-70" />
                <p className="text-sm opacity-70">Mengakses kamera...</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="text-center px-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[#334155] mb-4">
                  <VideoOff className="w-7 h-7 text-[#94A3B8]" />
                </div>
                <p className="text-sm text-white mb-2">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-brand rounded-md hover:bg-emerald-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Coba Lagi
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraState !== 'active' ? 'hidden' : ''}`}
            />

            {/* Scanning Frame Overlay */}
            {cameraState === 'active' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Dark overlay edges */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Clear center window */}
                <div
                  className="absolute bg-transparent border-2 border-white/80 rounded-md"
                  style={{
                    top: '10%',
                    left: '8%',
                    right: '8%',
                    bottom: '10%',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)',
                  }}
                />
                {/* Corner markers */}
                <div className="absolute" style={{ top: '10%', left: '8%' }}>
                  <div className="w-6 h-6 border-t-3 border-l-3 border-white rounded-tl" />
                </div>
                <div className="absolute" style={{ top: '10%', right: '8%' }}>
                  <div className="w-6 h-6 border-t-3 border-r-3 border-white rounded-tr" />
                </div>
                <div className="absolute" style={{ bottom: '10%', left: '8%' }}>
                  <div className="w-6 h-6 border-b-3 border-l-3 border-white rounded-bl" />
                </div>
                <div className="absolute" style={{ bottom: '10%', right: '8%' }}>
                  <div className="w-6 h-6 border-b-3 border-r-3 border-white rounded-br" />
                </div>
                {/* Guide text */}
                <div className="absolute bottom-[12%] left-0 right-0 text-center">
                  <p className="text-xs text-white/80 bg-black/40 inline-block px-3 py-1 rounded-md">
                    Posisikan catatan di dalam bingkai
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Capture Controls */}
          <div className="bg-white border-t border-[#E2E8F0] px-4 py-4">
            <div className="max-w-lg mx-auto flex items-center justify-center">
              <button
                onClick={capturePhoto}
                disabled={cameraState !== 'active'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-brand text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Camera className="w-5 h-5" />
                Jepret Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview + Form */}
      {(pageState === 'preview' || pageState === 'submitting') && (
        <div className="flex-1 flex flex-col">
          {/* Preview Image */}
          <div className="bg-[#1E293B] flex items-center justify-center p-4">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-[40vh] object-contain rounded-md border border-white/20"
            />
          </div>

          {/* Form Controls */}
          <div className="bg-white border-t border-[#E2E8F0] px-4 py-5 flex-1">
            <div className="max-w-lg mx-auto space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <div>
                <label htmlFor="shift" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Shift
                </label>
                <select
                  id="shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  disabled={pageState === 'submitting'}
                  className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-md bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand transition-colors disabled:opacity-60"
                >
                  <option value="Pagi">Pagi</option>
                  <option value="Siang">Siang</option>
                  <option value="Malam">Malam</option>
                </select>
              </div>

              <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Catatan Tambahan <span className="text-[#94A3B8] font-normal">(opsional)</span>
                </label>
                <textarea
                  id="catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  disabled={pageState === 'submitting'}
                  rows={3}
                  placeholder="Tulis catatan tambahan jika ada..."
                  className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-md bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand transition-colors resize-none disabled:opacity-60"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={retakePhoto}
                  disabled={pageState === 'submitting'}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-md hover:bg-[#F1F5F9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ambil Ulang
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={pageState === 'submitting'}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-brand rounded-md hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {pageState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim ke Owner
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
