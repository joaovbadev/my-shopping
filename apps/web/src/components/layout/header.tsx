'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout, isAdmin } = useAuthStore();
  const count = useCartStore((s) => s.count());

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          My Shopping
        </Link>

        <nav className="flex items-center gap-4">
          {user && isAdmin() && (
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button onClick={logout} className="text-gray-400 hover:text-gray-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                <User className="mr-1 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
