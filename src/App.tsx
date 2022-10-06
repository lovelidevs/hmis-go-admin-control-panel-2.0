import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider from "./Authentication/AuthProvider";
import RequireAuth from "./Authentication/RequireAuth";
import Home from "./Routes/Home";
import Login from "./Routes/Login";

const App = () => {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
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
