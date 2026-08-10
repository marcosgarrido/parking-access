import { useRef } from "react";
import { useBlocker } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";

export function useUnsavedChangesBlocker(isDirty: boolean) {
  const bypassRef = useRef(false);
  const { user } = useAuth();
  const blocker = useBlocker(() => isDirty && !bypassRef.current && !!user);

  const allowNextNavigation = () => {
    bypassRef.current = true;
  };

  return { blocker, allowNextNavigation };
}
