import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="voices" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-brand">Coming Soon</span>
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Share Your Experience
        </h2>
        <p className="mt-4 text-slate-600">
          We're building Jigyasu with love. Once we launch, we'll feature real stories from learners and parents here.
        </p>
      </div>

      <div className="mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-orange-500 to-rose-500 p-8 text-center text-white shadow-2xl shadow-orange-300/50 md:p-12">
        <h3 className="font-display text-3xl font-bold md:text-4xl">Ready to learn something today?</h3>
        <p className="mx-auto mt-3 max-w-xl text-orange-50">
          No sign-up. No download required. Open the app and start in your language in under 10 seconds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="#worlds" className="rounded-full bg-white px-6 py-3 text-base font-bold text-brand shadow-lg hover:bg-orange-50 transition active:scale-95">
            Pick your world →
          </a>
          <a href="#" className="rounded-full bg-white/15 px-6 py-3 text-base font-bold text-white backdrop-blur hover:bg-white/25 transition">
            Get the app
          </a>
        </div>
      </div>
    </section>
  );
}
