import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 grow pt-12">
        <Outlet />
      </main>
    </div>
  );
}
