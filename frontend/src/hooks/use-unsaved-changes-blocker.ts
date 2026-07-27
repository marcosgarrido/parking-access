import { useRef } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChangesBlocker(isDirty: boolean) {
  const bypassRef = useRef(false);

  const blocker = useBlocker(() => isDirty && !bypassRef.current);

  const allowNextNavigation = () => {
    bypassRef.current = true;
  };

  return { blocker, allowNextNavigation };
}
