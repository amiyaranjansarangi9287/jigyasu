import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-orange-100 bg-cream/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-2xl font-bold text-brand">Jigyasu</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-600">
              Free visual STEM learning for every child in India. Works offline. 6 Indian languages.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-slate-800">Information</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="/privacy" className="hover:text-brand">Privacy</a></li>
              <li><a href="/about" className="hover:text-brand">About Us</a></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-slate-800">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="mailto:ars.jobs2019@gmail.com" className="hover:text-brand">ars.jobs2019@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-orange-100 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Jigyasu. Made with ❤️ for India.</p>
        </div>
      </div>
    </footer>
  );
}
