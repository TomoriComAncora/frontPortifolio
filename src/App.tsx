import { createBrowserRouter } from "react-router";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { Detail } from "./pages/detail";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";

import { Layout } from "./components/layout";
import { PrivateRoute } from "./routes/PrivateRoute";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/project/:id",
        element: <Detail />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <PrivateRoute>
            <New />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/:id",
        element: (
          <PrivateRoute>
            <New />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
