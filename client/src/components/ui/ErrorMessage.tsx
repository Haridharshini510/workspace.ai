import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ message = 'Something went wrong.', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="h-8 w-8 text-neutral-400" />
      <p className="font-newsreader text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-neutral-950 px-4 py-1.5 font-satoshi text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          Retry
        </button>
      )}
    </div>
  )
}
