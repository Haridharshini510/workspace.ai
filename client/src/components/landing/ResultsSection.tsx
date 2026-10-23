const stats = [
  { value: '4', label: 'Item types tracked' },
  { value: '4', label: 'Commitment statuses' },
  { value: 'AI', label: 'Actionability built in' },
  { value: '1', label: 'Unified timeline view' },
]

export function ResultsSection() {
  return (
    <section id="results" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Built for Results
          </h3>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            A closer look at what Workspace.ai helps you achieve.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50"
            >
              <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {value}
              </span>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
