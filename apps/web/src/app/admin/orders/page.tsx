'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const statuses = ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELED'];

export default function AdminOrdersPage() {
  const { token, tenantId } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders', tenantId],
    queryFn: () => api.orders.list(token!, tenantId!),
    enabled: !!token && !!tenantId,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.orders.updateStatus(id, status, token!, tenantId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
          No orders yet
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="rounded-xl border bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                  <p className="mt-1 font-medium">{order.customer?.name}</p>
                  <p className="text-sm text-gray-500">{order.customer?.email}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
                  <Badge>{order.status}</Badge>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Items</p>
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus.mutate({ id: order.id, status })}
                      disabled={order.status === status}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        order.status === status
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
