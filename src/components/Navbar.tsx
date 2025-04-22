'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="bg-surface border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-primary text-xl font-bold">
              Tangerine
            </Link>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="text-foreground hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}