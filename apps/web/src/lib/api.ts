const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
  tenantId?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, tenantId, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (tenantId) headers['x-tenant-id'] = tenantId;

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    headers,
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }, tenantId: string) =>
      fetchAPI<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        tenantId,
      }),
    register: (data: { name: string; email: string; password: string }, tenantId: string) =>
      fetchAPI<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        tenantId,
      }),
  },
  products: {
    list: (tenantId: string) =>
      fetchAPI<any[]>('/products', { tenantId }),
    getById: (id: string, tenantId: string) =>
      fetchAPI<any>(`/products/${id}`, { tenantId }),
    create: (data: any, token: string, tenantId: string) =>
      fetchAPI<any>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
        tenantId,
      }),
    update: (id: string, data: any, token: string, tenantId: string) =>
      fetchAPI<any>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
        tenantId,
      }),
    delete: (id: string, token: string, tenantId: string) =>
      fetchAPI<any>(`/products/${id}`, {
        method: 'DELETE',
        token,
        tenantId,
      }),
  },
  orders: {
    list: (token: string, tenantId: string) =>
      fetchAPI<any[]>('/orders', { token, tenantId }),
    create: (data: any, token: string, tenantId: string) =>
      fetchAPI<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
        tenantId,
      }),
    updateStatus: (id: string, status: string, token: string, tenantId: string) =>
      fetchAPI<any>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        token,
        tenantId,
      }),
  },
  tenants: {
    list: () => fetchAPI<any[]>('/tenants'),
  },
};
