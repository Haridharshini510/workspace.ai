import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <span className="text-lg font-bold text-white">Workspace.ai</span>
          <p className="mt-2 text-sm">Intelligently organize your work.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
            <li><Link to="/app" className="hover:text-white">Get Started</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Tech Stack</h4>
          <p className="mt-3 text-sm">Built with React, Express &amp; MongoDB</p>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm">
        &copy; 2026 Workspace.ai
      </div>
    </footer>
  )
}
