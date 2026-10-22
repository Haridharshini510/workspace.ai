import { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const colorMap = {
  success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
  error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
}

export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg animate-fade-in-up ${colorMap[toast.type]}`}>
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 opacity-50 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
