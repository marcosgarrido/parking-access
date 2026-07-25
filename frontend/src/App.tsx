import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AppProvider } from "@/app-provider";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import { queryClient } from "@/query-client";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProvider>
        <Outlet />
      </AppProvider>
    ),
    children: [
      { path: "login", element: <LoginPage /> },
      { index: true, element: <HomePage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
