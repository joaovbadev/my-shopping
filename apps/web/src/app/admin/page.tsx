'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { token, tenantId } = useAuthStore();

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products', tenantId],
    queryFn: () => api.products.list(tenantId!),
    enabled: !!tenantId,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders', tenantId],
    queryFn: () => api.orders.list(token!, tenantId!),
    enabled: !!token && !!tenantId,
  });

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);

  const stats = [
    {
      label: 'Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="py-3">{order.customer?.name}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatPrice(order.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
