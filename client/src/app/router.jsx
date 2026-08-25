import React from "react";

const router = () => {
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

export default router;
