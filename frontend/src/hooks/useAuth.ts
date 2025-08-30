import { useState, useEffect, createContext, useContext } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useToast } from '@/hooks/use-toast';

export interface User extends Models.User<Models.Preferences> {
  role?: 'crew' | 'manager';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'crew' | 'manager') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // TEMPORARY: Bypass login for testing
      // Set this to false to re-enable authentication
      const bypassLogin = false;
      
      if (bypassLogin) {
        const mockUser = {
          $id: 'test-user-123',
          name: 'Test User',
          email: 'test@example.com',
          prefs: { role: 'crew' }
        } as unknown as User;
        setUser(mockUser);
        setLoading(false);
        return;
      }
      
      // Original authentication code
      const currentUser = await account.get();
      setUser(currentUser as User);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser as User);
      toast({
        title: "Login successful",
        description: `Welcome back, ${currentUser.name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'crew' | 'manager') => {
    try {
      setLoading(true);
      
      // Create account with auto-generated ID
      const newAccount = await account.create('unique()', email, password, name);
      
      // Create session first, then update preferences
      await account.createEmailPasswordSession(email, password);
      
      // Set user preferences with role after creating session
      await account.updatePrefs({ role });
      
      const currentUser = await account.get();
      setUser({ ...currentUser, role } as User);
      
      toast({
        title: "Account created",
        description: `Welcome to F&B DocBot, ${name}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "Failed to create account";
      
      if (error.code === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 400) {
        errorMessage = "Invalid email or password format";
      } else if (error.message?.includes('missing scopes')) {
        errorMessage = "Authentication not properly configured. Please check Appwrite project settings.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};

export { AuthContext };