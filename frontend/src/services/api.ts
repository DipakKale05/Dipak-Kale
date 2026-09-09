/**
 * GenricMed Frontend REST API Service Client
 * Connects frontend components to the backend REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// In-memory token storage (with localStorage fallback)
let authToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('genricmed_jwt') : null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('genricmed_jwt', token);
    } else {
      localStorage.removeItem('genricmed_jwt');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('genricmed_jwt');
  }
  return authToken;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Health & diagnostics
  health: {
    check: () => request<{ success: boolean; data: any }>('/health'),
  },

  // Authentication & Identity
  auth: {
    login: async (credentials: { email: string; password?: string }) => {
      const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res?.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    register: async (payload: {
      name: string;
      email: string;
      password?: string;
      phone: string;
      role: string;
      licenseNumber?: string;
      tenantId?: string;
    }) => {
      const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    sendOtp: (phone: string) =>
      request<{ success: boolean; data: { message: string; simulationCode?: string } }>('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      }),

    verifyOtp: async (phone: string, code: string) => {
      const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      });
      if (res?.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    verifyPasskey: async (payload: { credentialId: string; userHandle?: string }) => {
      const res = await request<{ success: boolean; data: { token: string; user: any } }>('/auth/passkey/verify', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    me: () => request<{ success: boolean; data: any }>('/auth/me'),

    logout: () => {
      setAuthToken(null);
    },
  },

  // Catalog & Bioequivalents
  medicines: {
    list: (params?: { search?: string; category?: string; brand?: string; isPrescriptionRequired?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.brand) query.append('brand', params.brand);
      if (params?.isPrescriptionRequired !== undefined) {
        query.append('isPrescriptionRequired', String(params.isPrescriptionRequired));
      }
      const qs = query.toString();
      return request<{ success: boolean; data: any[]; count: number }>(`/medicines${qs ? `?${qs}` : ''}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; data: any }>(`/medicines/${id}`),

    getSellers: (id: string) =>
      request<{ success: boolean; data: { medicine: any; sellers: any[]; bestPrice: number } }>(
        `/medicines/${id}/sellers`
      ),
  },
};

export default api;
