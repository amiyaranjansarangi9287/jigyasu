import { Navbar as SharedNavbar } from '@jigyasu/ui';

interface NavbarProps {
  onScrollTo: (section: string) => void;
  favoriteCount: number;
  onToggleFavPanel: () => void;
  onOpenWorkshop: () => void;
  onOpenSettings: () => void;
  buildCount: number;
}

export default function Navbar({ onScrollTo, favoriteCount, onToggleFavPanel, onOpenWorkshop, onOpenSettings, buildCount }: NavbarProps) {
  const desktopCenter = (
    <>
      {[
        { label: 'Featured', section: 'featured' },
        { label: 'Gallery', section: 'gallery' },
        { label: 'Reviews', section: 'testimonials' },
        { label: 'How It Works', section: 'how-it-works' },
      ].map((item) => (
        <button
          key={item.section}
          onClick={() => onScrollTo(item.section)}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:text-violet-600 hover:bg-violet-50 dark:text-gray-300 dark:hover:bg-violet-900/30"
        >
          {item.label}
        </button>
      ))}

      <button
        onClick={() => onScrollTo('gallery')}
        className="ml-3 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        Explore Toys
      </button>
    </>
  );

  const desktopRight = (
    <>
      {/* Workshop button */}
      <button
        onClick={onOpenWorkshop}
        className="relative px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-violet-600 hover:bg-violet-50 dark:text-gray-300 dark:hover:bg-violet-900/30"
        title="My Workshop"
       aria-label="Action button">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        {buildCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
            {buildCount}
          </span>
        )}
      </button>

      {/* Favorites button */}
      <button
        onClick={onToggleFavPanel}
        className="relative px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:text-gray-300 dark:hover:bg-rose-900/30"
        title="Favorites"
       aria-label="Action button">
        <svg className="w-5 h-5" fill={favoriteCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {favoriteCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
            {favoriteCount}
          </span>
        )}
      </button>

      {/* Settings button */}
      <button
        onClick={onOpenSettings}
        className="px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        title="Settings"
       aria-label="Action button">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </>
  );

  const mobileRight = (
    <>
      <button
        onClick={onOpenWorkshop}
        className="relative p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
       aria-label="Action button">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        {buildCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {buildCount}
          </span>
        )}
      </button>
      <button
        onClick={onToggleFavPanel}
        className="relative p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
       aria-label="Action button">
        <svg className="w-5 h-5" fill={favoriteCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {favoriteCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {favoriteCount}
          </span>
        )}
      </button>
    </>
  );

  const mobileMenuContent = ({ close }: { close: () => void }) => (
    <div className="p-4 space-y-2">
      {[
        { label: 'Featured', section: 'featured' },
        { label: 'Gallery', section: 'gallery' },
        { label: 'Reviews', section: 'testimonials' },
        { label: 'How It Works', section: 'how-it-works' },
      ].map((item) => (
        <button
          key={item.section}
          onClick={() => {
            onScrollTo(item.section);
            close();
          }}
          className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 py-3 px-4 rounded-xl transition-colors"
        >
          {item.label}
        </button>
      ))}
      <div className="pt-3 flex gap-2">
        <button
          onClick={() => {
            onOpenWorkshop();
            close();
          }}
          className="flex-1 py-3 text-sm font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center gap-2"
        >
          🏠 Workshop
        </button>
        <button
          onClick={() => {
            onOpenSettings();
            close();
          }}
          className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl"
        >
          ⚙️
        </button>
      </div>
      <div className="pt-2">
        <button
          onClick={() => {
            onScrollTo('gallery');
            close();
          }}
          className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl"
        >
          Explore Toys
        </button>
      </div>
    </div>
  );

  return (
    <SharedNavbar
      theme="toys"
      brandIcon={<span className="text-white text-lg">🧸</span>}
      brandClassName="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/50"
      brandText="ToyBox"
      onBrandClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      desktopCenter={desktopCenter}
      desktopRight={desktopRight}
      mobileRight={mobileRight}
      mobileMenuContent={mobileMenuContent}
    />
  );
}
