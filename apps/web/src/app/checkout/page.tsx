'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { token, tenantId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!token || !tenantId) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.orders.create(
        {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
        token,
        tenantId,
      );
      clearCart();
      router.push('/?ordered=true');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-2 text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total())}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </main>
    </>
  );
}
