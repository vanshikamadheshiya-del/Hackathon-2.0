import { useRoutes, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProductListPage from "../pages/products/ProductList";
import ProductFormPage from "../pages/products/ProductForm";
import ProductViewPage from "../pages/products/ProductView";
import ForgotPasswordPage from "../pages/ForgotPassword";
import UserListPage from "../pages/users/UserList";
import UserFormPage from "../pages/users/UserForm";

export default function AppRouter() {
  const routes = useRoutes([
    {
      path: "/auth",
      children: [
        {
          path: "login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: "register",
          element: (
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          ),
        },
        { path: "*", element: <Navigate to="/auth/login" replace /> },
      ],
    },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Navigate to="/products" replace /> },
        { path: "products", element: <ProductListPage /> },
        { path: "products/new", element: <ProductFormPage /> },
        { path: "products/edit/:id", element: <ProductFormPage /> },
        { path: "products/view/:id", element: <ProductViewPage /> },
        { path: "users", element: <UserListPage /> },
        { path: "users/new", element: <UserFormPage /> },
        { path: "users/edit/:id", element: <UserFormPage /> },
      ],
    },
    { path: "*", element: <Navigate to="/products" replace /> },
  ]);
  return routes;
}

