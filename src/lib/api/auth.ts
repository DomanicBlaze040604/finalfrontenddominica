import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const data = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      console.log('🔐 Login response:', data);
      
      // Handle different response structures
      if (data && typeof data === 'object') {
        // Check if response has success property
        if ('success' in data && data.success && 'data' in data && data.data) {
          const responseData = data.data as any;
          if (responseData.token) {
            this.setToken(responseData.token);
            if (responseData.user) {
              this.setUser(responseData.user);
            }
          }
          return data as AuthResponse;
        }
        
        // Handle direct token response (some backends return token directly)
        if ('token' in data && (data as any).token) {
          const token = (data as any).token;
          const user = (data as any).user || {
            id: '1',
            email: credentials.email,
            name: credentials.email.includes('admin') ? 'Admin User' : 'User',
            role: credentials.email.includes('admin') ? 'admin' : 'user'
          };
          
          this.setToken(token);
          this.setUser(user);
          
          return {
            success: true,
            data: { token, user }
          };
        }
      }
      
      throw new Error('Invalid response format from server');
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        throw error;
      }
      
      // Handle axios errors
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as any;
        const message = axiosError.response?.data?.message || 'Login failed';
        throw new Error(message);
      }
      
      throw new Error('Network error. Please check your connection.');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const data = await apiClient.get<{ success: boolean; data: User }>('/api/auth/me');
      if (data.success) {
        this.setUser(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuth();
    }
    
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    try {
      if (typeof token === 'string' && token.length > 0) {
        localStorage.setItem(this.tokenKey, token);
        console.log('✅ Token set successfully');
      } else {
        console.error('❌ Invalid token provided:', token);
      }
    } catch (error) {
      console.error('❌ Error setting token:', error);
    }
  }

  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.userKey);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user && typeof user === 'object' ? user : null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  setUser(user: User): void {
    try {
      if (user && typeof user === 'object' && user.id && user.email) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        console.log('✅ User set successfully:', user);
      } else {
        console.error('❌ Invalid user provided:', user);
      }
    } catch (error) {
      console.error('❌ Error setting user:', error);
    }
  }

  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  }
}

export const authService = new AuthService();
export default authService;