import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 animate-blob blur-3xl" />

      {/* Floating emojis */}
      <div className="absolute top-[10%] left-[10%] text-4xl animate-float opacity-15 select-none hidden md:block">🧸</div>
      <div className="absolute top-[20%] right-[15%] text-3xl animate-float-delayed opacity-15 select-none hidden md:block">🎨</div>
      <div className="absolute bottom-[15%] left-[20%] text-4xl animate-float opacity-10 select-none hidden md:block" style={{ animationDelay: '1s' }}>🔨</div>
      <div className="absolute bottom-[20%] right-[10%] text-3xl animate-float-delayed opacity-15 select-none hidden md:block" style={{ animationDelay: '2s' }}>✨</div>

      <div ref={sectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-white/20">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Stay Updated
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
            Get New Toy Projects{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Every Week
            </span>
          </h2>

          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Subscribe to our newsletter and be the first to know about new toy projects, building tips, and exclusive tutorials.
          </p>

          {submitted ? (
            <div className="animate-scale-in bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
              <p className="text-white/70 text-sm">Check your inbox for a welcome surprise. Happy building!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
              >
                Subscribe ✨
              </button>
            </form>
          )}

          <p className="text-xs text-white/40 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
