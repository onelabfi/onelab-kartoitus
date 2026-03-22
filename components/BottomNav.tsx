'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Etusivu', icon: '🏠' },
    { href: '/kartoitukset', label: 'Kartoitukset', icon: '📋' },
    { href: '/raportit', label: 'Raportit', icon: '📄' },
    { href: '/asetukset', label: 'Asetukset', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{ background: 'rgba(28,28,30,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
      <div className="flex max-w-md mx-auto">
        {items.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-medium" style={{ color: active ? '#2563EB' : 'rgba(255,255,255,0.4)' }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
