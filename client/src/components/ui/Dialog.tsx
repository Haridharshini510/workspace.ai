import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 200)
      document.body.style.overflow = ''
      return () => clearTimeout(timer)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!mounted) return null

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={`w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-satoshi text-lg font-semibold text-neutral-950 dark:text-neutral-50">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
