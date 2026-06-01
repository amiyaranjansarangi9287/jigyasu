import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  emoji?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-slate-300 pointer-events-none select-none">/</span>
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 hover:text-sky-500 transition-colors bg-white/50 px-2 py-1 rounded-lg hover:bg-white"
                >
                  {item.emoji && <span className="text-base">{item.emoji}</span>}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-slate-700 bg-white/50 px-2 py-1 rounded-lg"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.emoji && <span className="text-base">{item.emoji}</span>}
                  <span className="font-bold">{item.label}</span>
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
