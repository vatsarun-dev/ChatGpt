import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedChat from "./ProtectedChat.jsx";
import ProtectedAuth from "./ProtectedAuth.jsx";
import Home from "../feature/chat/ui/pages/Home.jsx";
import Login from "../feature/auth/ui/pages/Login.jsx";
import Register from "../feature/auth/ui/pages/Register.jsx";
const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/chat",
      element: <ProtectedChat />,
      children: [
        {
          path: "",
          element: <Home />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedAuth />,
      children: [
        {
          path: "",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default Router;
