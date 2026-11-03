import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Toast, type ToastData } from './Toast'

interface ToastContextValue {
  addToast: (message: string, type?: ToastData['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((message: string, type: ToastData['type'] = 'info') => {
    const id = String(++nextId)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  useEffect(() => {
    const handler = () => addToast('Slow down — too many requests. Please wait a moment.', 'warning')
    window.addEventListener('rate-limited', handler)
    return () => window.removeEventListener('rate-limited', handler)
  }, [addToast])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 sm:bottom-4">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
