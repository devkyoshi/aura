'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios.config';
import toast from 'react-hot-toast';

const STORAGE_KEY = (process.env.NEXT_APP_NAME as string) || 'aura';

interface AuthContextProps {
  currentUser: ICurrentUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user_data: ILoginResponse | null = getAuthFromLocalStorage();
      if (user_data) {
        setToken(user_data.access_token);
        setCurrentUser(user_data.user);
      }
    }
  }, []);


  const login = async (credentials: ILoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', credentials);
      const userdata: ILoginResponse | null = response.data.data;

      if (response.data.success && userdata) {
        saveAuthToLocalStorage(userdata);
        setCurrentUser(userdata.user);
        setToken(userdata.access_token);

        toast.success(response.data.message || 'Login successful');

        // Redirect to the home page
        router.push('/');
      } else {
        toast.error(response.data.message || 'Login failed. Please try again.');
        router.push('/auth/login');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    removeAuthFromLocalStorage();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, token, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const saveAuthToLocalStorage = (user_data: ILoginResponse) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user_data));
};

export const getAuthFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  const user_data = localStorage.getItem(STORAGE_KEY as string);
  return user_data ? JSON.parse(user_data) as ILoginResponse : null;
};

export const removeAuthFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
