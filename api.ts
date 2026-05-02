import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/config';

const API_BASE_URL = API_CONFIG.baseURL;

export interface Transaction {
  id?: number;
  tradeId: string;
  instrumentType: string;
  amount: number;
  currency: string;
  status: string;
  tradeDate: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CORS headers
apiClient.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export const transactionApi = {
  // Submit a new transaction
  submitTransaction: async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await apiClient.post<Transaction>('/transactions', transaction);
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<Record<string, string>>;
      return { error: axiosError.response?.data?.message || 'Failed to submit transaction' };
    }
  },

  // Get all transactions or filter by status
  getTransactions: async (status?: string) => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<Transaction[]>('/transactions', { params });
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { error: 'Failed to fetch transactions' };
    }
  },

  // Get transactions report by date range
  getReport: async (from: string, to: string) => {
    try {
      const response = await apiClient.get<Transaction[]>('/transactions/report', {
        params: { from, to },
      });
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { error: 'Failed to fetch report' };
    }
  },
};
