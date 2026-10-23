import { Link } from 'react-router-dom'

export function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-20 text-center sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Take Control of Your Workspace?
        </h3>
        <p className="mt-4 text-lg text-white/80">
          Stop losing track of what matters. Start organizing with AI.
        </p>
        <Link
          to="/app"
          className="mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:bg-gray-100"
        >
          Launch Workspace
        </Link>
      </div>
    </section>
  )
}
