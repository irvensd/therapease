import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Demo account credentials
const DEMO_CREDENTIALS = {
  email: "demo@therapease.com",
  password: "demo123",
  name: "Dr. Sarah Wilson",
  title: "Licensed Clinical Psychologist",
};

interface User {
  id: string;
  email: string;
  name: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
    title: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (
    updates: Partial<Pick<User, "name" | "title" | "email">>,
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("therapease_user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading saved user:", error);
        localStorage.removeItem("therapease_user");
      } finally {
        setIsLoading(false);
      }
    };

    // Check immediately
    checkAuth();
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Check demo credentials
      if (
        email === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        const userData: User = {
          id: "demo-user-1",
          email: DEMO_CREDENTIALS.email,
          name: DEMO_CREDENTIALS.name,
          title: DEMO_CREDENTIALS.title,
        };

        setUser(userData);
        localStorage.setItem("therapease_user", JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      }

      // Check if it's a valid email format for demo purposes
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsLoading(false);
        return { success: false, error: "Please enter a valid email address" };
      }

      // For other emails, simulate account creation as demo
      if (password.length >= 6) {
        const userData: User = {
          id: `user-${Date.now()}`,
          email,
          name: email
            .split("@")[0]
            .replace(/[._]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          title: "Therapist",
        };

        setUser(userData);
        localStorage.setItem("therapease_user", JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    title: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      // Basic validation
      if (!name.trim()) {
        setIsLoading(false);
        return { success: false, error: "Name is required" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsLoading(false);
        return { success: false, error: "Please enter a valid email address" };
      }

      if (password.length < 6) {
        setIsLoading(false);
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      // Create new user (simulated)
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name: name.trim(),
        title: title.trim() || "Therapist",
      };

      setUser(userData);
      localStorage.setItem("therapease_user", JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("therapease_user");
    localStorage.removeItem("therapease_settings");
    // Clear other app data if needed
  };

  const updateProfile = (
    updates: Partial<Pick<User, "name" | "title" | "email">>,
  ) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("therapease_user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
