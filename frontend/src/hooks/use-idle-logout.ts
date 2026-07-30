import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "@/api/auth";
import { useAuth } from "@/hooks/use-auth";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll"] as const;

export function useIdleLogout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function reset() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout().finally(() => {
          setUser(null);
          navigate("/login", { replace: true });
        });
      }, IDLE_TIMEOUT_MS);
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset));
    reset();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, reset),
      );
    };
  }, [navigate, setUser]);
}
