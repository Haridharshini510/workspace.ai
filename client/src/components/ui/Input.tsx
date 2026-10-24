import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block font-satoshi text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-lg border px-3 py-2 font-newsreader text-sm transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-950 dark:border-neutral-700 dark:focus:border-neutral-50 dark:focus:ring-neutral-50'
        } bg-white dark:bg-neutral-900 dark:text-neutral-100 ${className}`}
        {...props}
      />
      {error && <p className="font-satoshi text-xs text-red-500">{error}</p>}
    </div>
  )
}
