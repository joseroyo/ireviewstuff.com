"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

type AuthContextValue = {
  user: User | null;
  isAuthLoading: boolean;
  isRecoveringPassword: boolean;
  adsEnabled: boolean;
  toggleAds: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthLoading: true,
  isRecoveringPassword: false,
  adsEnabled: false,
  toggleAds: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveringPassword(true);

        if (pathname !== "/update-password") {
          router.push("/update-password");
        }
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [pathname, router]);

  useEffect(() => {
    if (localStorage.getItem("ads-enabled") === "true") {
      setAdsEnabled(true);
    }
  }, []);

  function toggleAds() {
    const next = !adsEnabled;
    setAdsEnabled(next);
    localStorage.setItem("ads-enabled", next ? "true" : "false");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, isRecoveringPassword, adsEnabled, toggleAds }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}