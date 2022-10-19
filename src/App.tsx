import React from "react";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import APIProvider from "./API/APIProvider";
import AuthProvider from "./Authentication/AuthProvider";
import RequireAuth from "./Authentication/RequireAuth";
import Home from "./Routes/Home";
import ClientSearch from "./Routes/Home/ClientSearch";
import LocationEditor from "./Routes/Home/LocationEditor";
import NotesEditor from "./Routes/Home/NotesEditor";
import Reports from "./Routes/Home/Reports";
import ServiceEditor from "./Routes/Home/ServiceEditor";
import UserEditor from "./Routes/Home/UserEditor";
import Login from "./Routes/Login";
import RequestAccess from "./Routes/RequestAccess";
import RequestResetPassword from "./Routes/RequestResetPassword";
import SignUp from "./Routes/SignUp";

const App = () => {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/request-reset-password", element: <RequestResetPassword /> },
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
