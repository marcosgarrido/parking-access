import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AppProvider } from "@/app-provider";
import DefaultLayout from "@/layouts/default-layout";
import AccessPage from "@/pages/access";
import AppUsersPage from "@/pages/app-users";
import DeleteParkingUserPage from "@/pages/delete-parking-user";
import DeleteParkingUsersPage from "@/pages/delete-parking-users";
import EditParkingUserPage from "@/pages/edit-parking-user";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NewParkingUserPage from "@/pages/new-parking-user";
import ParkingUsersPage from "@/pages/parking-users";
import RecordsPage from "@/pages/records";
import ViewParkingUserPage from "@/pages/view-parking-user";
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
          {
            path: "parking-users",
            children: [
              {
                path: "",
                element: <ParkingUsersPage />,
                children: [
                  { path: ":id/delete", element: <DeleteParkingUserPage /> },
                  { path: "delete-many", element: <DeleteParkingUsersPage /> },
                ],
              },
              { path: "new", element: <NewParkingUserPage /> },
              {
                path: ":id",
                children: [
                  { index: true, element: <ViewParkingUserPage /> },
                  { path: "edit", element: <EditParkingUserPage /> },
                ],
              },
            ],
          },
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
