import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎈</div>
          <h1 className="font-serif text-4xl font-bold text-ink mb-2">Page not found</h1>
          <p className="font-mono text-dim text-sm mb-8">The page you are looking for does not exist.</p>
          <Link to="/" className="bg-primary text-white font-mono px-8 py-3 rounded-full min-h-[44px] inline-flex items-center hover:opacity-90 transition-opacity">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}
