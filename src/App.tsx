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
import Reports from "./Routes/Home/Reports";
import ServiceEditor from "./Routes/Home/ServiceEditor";
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
          <Home />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Navigate to="reports" replace /> },
        { path: "reports", element: <Reports /> },
        { path: "services", element: <ServiceEditor /> },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <APIProvider>
          <RouterProvider router={router} />
        </APIProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
