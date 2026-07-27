import { useLocation } from "react-router-dom";

export function useQueryString() {
  return useLocation().search;
}
