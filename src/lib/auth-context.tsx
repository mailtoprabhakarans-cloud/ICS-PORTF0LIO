import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase, type UserProfile } from "./supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup" | "forgot";
  isAccountDrawerOpen: boolean;
  openAuthModal: (mode?: "signin" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string | undefined; phone?: string | undefined; company_name?: string | undefined },
  ) => Promise<{ error: Error | null; user: User | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER_KEY = "ics_demo_user";
const DEMO_PROFILE_KEY = "ics_demo_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  // Fetch or setup profile
  const fetchProfile = async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured) {
      const savedProfile = localStorage.getItem(DEMO_PROFILE_KEY);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
          return;
        } catch {
          // fallback
        }
      }
      const initial: UserProfile = {
        id: userId,
        full_name: (user?.user_metadata && user.user_metadata["full_name"]) || "ICS Customer",
        email: userEmail,
        phone: (user?.user_metadata && user.user_metadata["phone"]) || "+91 98422 12345",
        city: "Coimbatore",
      };
      setProfile(initial);
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(initial));
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
      } else {
        // Create initial profile if missing
        const newProfile: UserProfile = {
          id: userId,
          full_name:
            (user?.user_metadata && user.user_metadata["full_name"]) ||
            userEmail.split("@")[0] ||
            "Customer",
          email: userEmail,
          phone: (user?.user_metadata && user.user_metadata["phone"]) || "",
          city: "Coimbatore",
        };
        await supabase.from("profiles").upsert(newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Offline / Local Demo mode
      const savedDemoUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          fetchProfile(parsed.id, parsed.email);
        } catch {
          // Ignore
        }
      }
      setIsLoading(false);
      return;
    }

    // Supabase Live Auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (mode: "signin" | "signup" | "forgot" = "signin") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAccountDrawer = () => {
    setIsAccountDrawerOpen(true);
  };

  const closeAccountDrawer = () => {
    setIsAccountDrawerOpen(false);
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      // Local demo mode sign in
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split("@")[0] },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      await fetchProfile(mockUser.id, email);
      closeAuthModal();
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      closeAuthModal();
    }
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string | undefined; phone?: string | undefined; company_name?: string | undefined },
  ): Promise<{ error: Error | null; user: User | null }> => {
    if (!isSupabaseConfigured) {
      // Local demo mode sign up
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: metadata || { full_name: email.split("@")[0] },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      const demoProf: UserProfile = {
        id: mockUser.id,
        full_name: metadata?.full_name || email.split("@")[0] || "Customer",
        email,
        phone: metadata?.phone || "",
        company_name: metadata?.company_name || "",
        city: "Coimbatore",
      };
      setProfile(demoProf);
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProf));
      closeAuthModal();
      return { error: null, user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      ...(metadata ? { options: { data: metadata } } : {}),
    });

    if (!error && data.user) {
      closeAuthModal();
    }
    return { error, user: data.user };
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      // Local demo mode Google sign in
      const mockUser: User = {
        id: `demo-google-user-${Date.now()}`,
        email: "google.user@example.com",
        app_metadata: { provider: "google" },
        user_metadata: { full_name: "Google Customer" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      const demoProf: UserProfile = {
        id: mockUser.id,
        full_name: "Google Customer",
        email: "google.user@example.com",
        city: "Coimbatore",
      };
      setProfile(demoProf);
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProf));
      closeAuthModal();
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem(DEMO_USER_KEY);
      closeAccountDrawer();
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    closeAccountDrawer();
  };

  const resetPasswordForEmail = async (email: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error("Not authenticated") };

    const updated = { ...(profile || {}), ...updates, id: user.id } as UserProfile;
    setProfile(updated);

    if (!isSupabaseConfigured) {
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updated));
      return { error: null };
    }

    const { error } = await supabase.from("profiles").upsert(updated);
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        isAccountDrawerOpen,
        openAuthModal,
        closeAuthModal,
        openAccountDrawer,
        closeAccountDrawer,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPasswordForEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
