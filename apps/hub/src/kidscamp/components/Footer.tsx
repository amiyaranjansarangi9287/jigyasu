// CampCraft - Footer

import { pillars } from '../data/categories';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">�</span>
              <span className="text-2xl font-bold text-white">Jigyasu</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Free visual STEM learning for every child in India. Works offline. 6 Indian languages.
            </p>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-white font-bold mb-4">Activities</h4>
            <ul className="space-y-2">
              {pillars.map((pillar) => (
                <li key={pillar.id}>
                  <button
                    onClick={() => onNavigate(`pillar-${pillar.id}`)}
                    className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                  >
                    <span>{pillar.icon}</span>
                    <span>{pillar.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('activities')}
                  className="hover:text-orange-400 transition-colors"
                >
                  All Activities →
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('camp-weeks')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Project Weeks
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Printable Checklists
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Material Substitutes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="hover:text-orange-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Jigyasu. Made with ❤️ for India.
          </p>
        </div>
      </div>
    </footer>
  );
}

