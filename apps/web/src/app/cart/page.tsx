'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <p className="text-gray-500">Your cart is empty</p>
            <Link href="/">
              <Button className="mt-4" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border bg-white p-4"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="rounded-md border p-1 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="rounded-md border p-1 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="w-24 text-right font-medium">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="rounded-xl border bg-white p-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total())}</span>
              </div>
              <div className="mt-4">
                {user ? (
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full" size="lg">
                      Login to Checkout
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
