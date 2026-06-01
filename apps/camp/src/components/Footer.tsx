// CampCraft - Footer

import { pillars } from '../data/categories';
import { Footer as SharedFooter } from '@jigyasu/ui';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const columns = [
    {
      title: 'Activities',
      links: [
        ...pillars.map((pillar) => ({
          label: `${pillar.icon} ${pillar.name}`,
          onClick: () => onNavigate(`pillar-${pillar.id}`)
        })),
        { label: 'All Activities →', onClick: () => onNavigate('activities') }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Camp Weeks', onClick: () => onNavigate('camp-weeks') },
        { label: 'Printable Checklists', href: '#' },
        { label: 'Safety Tips', href: '#' },
        { label: 'Material Substitutes', href: '#' },
        { label: 'FAQs', href: '#' }
      ]
    }
  ];

  const newsletterColumn = (
    <div className="flex flex-col">
      <h4 className="text-white font-bold mb-4">Stay Updated</h4>
      <p className="text-gray-400 text-sm mb-4">
        Get weekly activity ideas and seasonal project inspiration.
      </p>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
        />
        <button
          type="submit"
          className="w-full btn btn-primary text-sm py-2"
        >
          Subscribe
        </button>
      </form>
    </div>
  );

  const socials = [
    <a key="1" href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    </a>,
    <a key="2" href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>,
    <a key="3" href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
    </a>,
    <a key="4" href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
      </svg>
    </a>
  ];

  return (
    <SharedFooter
      theme="camp"
      brandIcon={<span className="text-3xl">🏕️</span>}
      brandText="CampCraft"
      brandDescription="Summer camp at home. Spark creativity, build skills, and create lasting memories with hands-on activities for ages 3-12."
      columns={columns}
      extraColumns={[newsletterColumn]}
      socials={socials}
    />
  );
}
