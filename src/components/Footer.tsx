import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-dim-dark font-mono text-sm">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-serif text-paper text-lg">Getfetti 🎉</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-paper transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-paper transition-colors">Terms</Link>
          <a href="mailto:hello@getfetti.com" className="hover:text-paper transition-colors">Contact</a>
        </div>
        <span>&copy; {new Date().getFullYear()} Getfetti</span>
      </div>
    </footer>
  )
}
