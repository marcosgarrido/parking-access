import { useIsFetching } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import { DelayedSpinnerOverlay } from "@/components/delayed-spinner-overlay";
import { Navbar } from "@/components/navbar";
import { useIdleLogout } from "@/hooks/use-idle-logout";

export default function DefaultLayout() {
  const isFetching = useIsFetching() > 0;

  useIdleLogout();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-6xl px-6 grow pt-12">
        <Outlet />
      </main>
      <DelayedSpinnerOverlay delay={250} show={isFetching} size="lg" />
    </div>
  );
}
