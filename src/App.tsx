import React from "react";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import APIProvider from "./API/APIProvider";
import AuthProvider from "./Authentication/AuthProvider";
import RequireAuth from "./Authentication/RequireAuth";
import RequireSuperAdmin from "./Authentication/RequireSuperAdmin";
import EmailConfirmation from "./Routes/EmailConfirmation";
import Home from "./Routes/Home";
import ClientSearch from "./Routes/Home/ClientSearch";
import LocationEditor from "./Routes/Home/LocationEditor";
import NotesEditor from "./Routes/Home/NotesEditor";
import Reports from "./Routes/Home/Reports";
import ServiceEditor from "./Routes/Home/ServiceEditor";
import SuperAdminReports from "./Routes/Home/SuperAdminReports";
import SuperAdminUserEditor from "./Routes/Home/SuperAdminUserEditor";
import UserEditor from "./Routes/Home/UserEditor";
import Login from "./Routes/Login";
import RequestAccess from "./Routes/RequestAccess";
import RequestResetPassword from "./Routes/RequestResetPassword";
import ResetPassword from "./Routes/ResetPassword";
import SignUp from "./Routes/SignUp";

const App = () => {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/email-confirmation", element: <EmailConfirmation /> },
    { path: "/request-reset-password", element: <RequestResetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/request-access", element: <RequestAccess /> },
    {
      path: "/",
      element: (
        <RequireAuth>
          <APIProvider>
            <Home />
          </APIProvider>
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Navigate to="reports" replace /> },
        { path: "reports", element: <Reports /> },
        { path: "services", element: <ServiceEditor /> },
        { path: "locations", element: <LocationEditor /> },
        { path: "clients", element: <ClientSearch /> },
        { path: "notes", element: <NotesEditor /> },
        {
          path: "users",
          element: (
            <RequireAuth requireAdminAuth={true}>
              <UserEditor />
            </RequireAuth>
          ),
        },
        {
          path: "superUsers",
          element: (
            <RequireSuperAdmin>
              <SuperAdminUserEditor />
            </RequireSuperAdmin>
          ),
        },
        {
          path: "superReports",
          element: (
            <RequireSuperAdmin>
              <SuperAdminReports />
            </RequireSuperAdmin>
          ),
        },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
