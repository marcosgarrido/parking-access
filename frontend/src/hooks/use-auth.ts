import type { AppUserSession } from "@parking-access/schemas";
import { createContext, useContext } from "react";

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
