import { ReactNode } from 'react';
import { cn } from '@jigyasu/utils';

export interface FooterColumn {
  title: string;
  links: { label: string; onClick?: () => void; href?: string }[];
}

export interface FooterProps {
  brandIcon: ReactNode;
  brandText: string;
  brandDescription: string;
  brandIconClassName?: string;
  socials?: ReactNode[];
  columns: FooterColumn[];
  extraColumns?: ReactNode[];
  theme?: 'camp' | 'toys' | 'learn';
  copyrightYear?: number;
  bottomLinks?: { label: string; href: string }[];
}

export function Footer({
  brandIcon,
  brandText,
  brandDescription,
  brandIconClassName,
  socials = [],
  columns = [],
  extraColumns = [],
  theme = 'camp',
  copyrightYear = new Date().getFullYear(),
  bottomLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' }
  ]
}: FooterProps) {
  const isToys = theme === 'toys';

  return (
    <footer className={cn(
      "text-white pt-16 pb-8 relative overflow-hidden",
      isToys ? "bg-gray-950" : "bg-gray-900"
    )}>
      {/* Decorative top gradient for toys */}
      {isToys && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-500/5 blur-3xl" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={cn(
          "grid gap-12 mb-16",
          columns.length <= 2 ? "md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-12"
        )}>
          {/* Brand */}
          <div className={cn(
            columns.length <= 2 ? "lg:col-span-1" : "md:col-span-5"
          )}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className={cn("flex items-center justify-center", brandIconClassName)}>
                {brandIcon}
              </div>
              <span className="text-2xl font-bold">{brandText}</span>
            </div>
            <p className={cn(
              "leading-relaxed mb-6",
              isToys ? "text-gray-400 max-w-sm" : "text-gray-400 text-sm"
            )}>
              {brandDescription}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map((social, idx) => (
                  <span key={idx}>
                    {social}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className={cn(
              columns.length > 2 && "md:col-span-2"
            )}>
              <h3 className={cn(
                "font-bold mb-4",
                isToys ? "text-sm uppercase tracking-wider text-gray-400" : "text-white"
              )}>
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className={cn(
                          "transition-colors text-left",
                          isToys ? "text-gray-400 hover:text-white text-sm hover:translate-x-1 inline-block transition-transform" : "hover:text-orange-400"
                        )}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href || '#'}
                        className={cn(
                          "transition-colors text-left",
                          isToys ? "text-gray-400 hover:text-white text-sm hover:translate-x-1 inline-block transition-transform" : "hover:text-orange-400"
                        )}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Extra Custom Columns */}
          {extraColumns.map((col, idx) => (
            <div key={`extra-${idx}`} className={cn(
              (columns.length + extraColumns.length) > 2 && "md:col-span-2"
            )}>
              {col}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4",
          isToys ? "border-t border-white/5" : "border-t border-gray-800"
        )}>
          <p className={cn(
            isToys ? "text-sm text-gray-600" : "text-gray-500 text-sm"
          )}>
            © {copyrightYear} {brandText}. {isToys ? 'Crafted with ❤️ for makers everywhere.' : 'Made with ❤️ for creative families.'}
          </p>
          <div className={cn(
            "flex items-center gap-6",
            isToys ? "text-sm text-gray-600" : "text-sm text-gray-500"
          )}>
            {bottomLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className={cn(
                  "transition-colors",
                  isToys ? "hover:text-gray-400" : "hover:text-gray-300"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
