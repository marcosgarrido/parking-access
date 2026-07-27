import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const expiry = localStorage.getItem("sessionExpiresAt");

    if (!expiry) return;

    const ms = Number(expiry) - Date.now() - 3000;

    if (ms <= 0) {
      navigate("/login", { replace: true });

      return;
    }

    const id = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, ms);

    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-6xl px-6 grow pt-12">
        <Outlet />
      </main>
    </div>
  );
}
