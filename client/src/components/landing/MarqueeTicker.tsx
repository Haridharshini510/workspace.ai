const items = [
  '/INFORMATION',
  '/OPPORTUNITIES',
  '/EVENTS',
  '/COMMITMENTS',
  '/TIMELINE',
  '/AI-POWERED',
]

export function MarqueeTicker() {
  const content = items.join('   ·   ')

  return (
    <div className="overflow-hidden bg-gray-900 py-3 dark:bg-black">
      <div className="animate-marquee flex whitespace-nowrap hover:[animation-play-state:paused]">
        <span className="mx-8 text-sm font-medium tracking-widest text-gray-300">
          {content}
        </span>
        <span className="mx-8 text-sm font-medium tracking-widest text-gray-300">
          {content}
        </span>
      </div>
    </div>
  )
}
