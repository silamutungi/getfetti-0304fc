import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: '📋', title: 'Host Brief', body: 'A calm, prioritized view. Likely attendance, unresolved maybes, and the three things to handle now. No dashboard clutter.' },
  { icon: '🤔', title: 'Better Maybe', body: 'When guests pick Maybe, they pick a reason too. Schedule conflict. Arriving late. Waiting on a plus-one. Turns vague into useful.' },
  { icon: '✨', title: 'Dual View', body: 'One event, two invite modes. Vibe View keeps things warm and expressive for friends. Simple View stays clean for family or coworkers.' },
  { icon: '🎨', title: 'Smart Themes', body: 'Dinner events prompt dietary notes. Rooftop parties flag a weather backup. Housewarmings surface registry links. Context baked in.' }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-24 text-center">
          <div className="inline-block bg-ink text-acid font-mono text-xs px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
            Invites that help you host
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl font-extrabold text-ink leading-tight mb-6">
            The invite that
            <br />
            <span className="text-primary">actually helps.</span>
          </h1>
          <p className="font-mono text-lg text-dim max-w-xl mx-auto mb-10 leading-relaxed">
            Beautiful invite pages. Smart RSVPs that tell you who is actually coming.
            A Host Brief so you always know what to handle next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-full text-base min-h-[52px] flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-paper"
            >
              Create your first event
            </Link>
            <Link
              to="/login"
              className="border-2 border-primary-dark text-primary-dark font-mono font-medium px-8 py-4 rounded-full text-base min-h-[52px] flex items-center justify-center hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="bg-ink py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-paper text-center mb-12">
              Hosting should feel calm, not chaotic.
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map(f => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-serif text-xl text-paper mb-2">{f.title}</h3>
                  <p className="font-mono text-sm text-dim-dark leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">
            Built for birthdays, dinners, and the people you care about.
          </h2>
          <p className="font-mono text-dim text-base mb-10 leading-relaxed">
            Not as ironic as Partiful. Not as formal as Paperless Post.
            Just the right tool for a host who wants to know what is actually happening.
          </p>
          <Link
            to="/signup"
            className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-full text-base min-h-[52px] inline-flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Get started free
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
