import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { AppProvider } from "@/app-provider";
import DefaultLayout from "@/layouts/default-layout";
import AccessPage from "@/pages/access";
import AppUsersPage from "@/pages/app-users";
import DeleteAppUserPage from "@/pages/delete-app-user";
import DeleteAppUsersPage from "@/pages/delete-app-users";
import DeleteParkingUserPage from "@/pages/delete-parking-user";
import DeleteParkingUsersPage from "@/pages/delete-parking-users";
import DeleteRecordsPage from "@/pages/delete-records";
import EditAppUserPage from "@/pages/edit-app-user";
import EditParkingUserPage from "@/pages/edit-parking-user";
import LoginPage from "@/pages/login";
import NewAppUserPage from "@/pages/new-app-user";
import NewParkingUserPage from "@/pages/new-parking-user";
import ParkingUsersPage from "@/pages/parking-users";
import RecordsPage from "@/pages/records";
import ViewParkingUserPage from "@/pages/view-parking-user";
import { queryClient } from "@/query-client";
import { initializeWebSocketClient } from "@/services/ws/ws-client";

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
          { index: true, element: <Navigate replace to="/access" /> },
          { path: "access", element: <AccessPage /> },
          {
            path: "records",
            element: <RecordsPage />,
            children: [{ path: "delete-many", element: <DeleteRecordsPage /> }],
          },
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
          {
            path: "app-users",
            children: [
              {
                path: "",
                element: <AppUsersPage />,
                children: [
                  { path: ":id/delete", element: <DeleteAppUserPage /> },
                  { path: "delete-many", element: <DeleteAppUsersPage /> },
                ],
              },
              { path: "new", element: <NewAppUserPage /> },
              {
                path: ":id",
                children: [{ path: "edit", element: <EditAppUserPage /> }],
              },
            ],
          },
        ],
      },
    ],
  },
]);

initializeWebSocketClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
