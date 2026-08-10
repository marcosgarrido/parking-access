import { RouterProvider, Toast, useTheme } from "@heroui/react";
import type { AppUserSession } from "@parking-access/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { NavigateOptions } from "react-router-dom";
import { useHref, useLocation, useNavigate } from "react-router-dom";

import { fetchMe } from "@/api/auth";
import { setUnauthorizedHandler } from "@/api/client";
import { WS_EVENTS } from "@/constants/ws-events";
import { AuthContext } from "@/hooks/use-auth";
import { useSocketSubscribe } from "@/hooks/use-socket-subscribe";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AppUserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(user);

  useTheme();

  useSocketSubscribe(WS_EVENTS.NEW_RECORD, () => {
    queryClient.invalidateQueries({ queryKey: ["records"] });
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (userRef.current) Toast.toast.danger("Tu sesión ha caducado");
      setUser(null);
      queryClient.clear();
    });
  }, [queryClient]);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const me = await fetchMe();

        if (mounted) setUser(me);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const isLoginPage = location.pathname === "/login";

    if (!user && !isLoginPage) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider navigate={navigate} useHref={useHref}>
        {children}
      </RouterProvider>
    </AuthContext.Provider>
  );
}
