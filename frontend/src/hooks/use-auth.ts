import { createContext, useContext } from "react";

import type { AppUserSession } from "@/schemas/auth-schema";

export type AuthContextType = {
  user: AppUserSession | null;
  setUser: (u: AppUserSession | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
