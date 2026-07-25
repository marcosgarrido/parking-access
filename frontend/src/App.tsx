import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AppProvider } from "@/app-provider";
import DefaultLayout from "@/layouts/default-layout";
import AccessPage from "@/pages/access";
import AppUsersPage from "@/pages/app-users";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import ParkingUsersPage from "@/pages/parking-users";
import RecordsPage from "@/pages/records";
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
      {
        path: "",
        element: <DefaultLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "access", element: <AccessPage /> },
          { path: "records", element: <RecordsPage /> },
          { path: "parking-users", element: <ParkingUsersPage /> },
          { path: "app-users", element: <AppUsersPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
