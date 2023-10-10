import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Users from "./components/Users";
import User from "./components/User";
import Product from "./components/Product/Product";
import Products from "./components/Products/Products";
import SignUp from "./components/SignUp";
import ProductForm from "./components/ProductForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile/Profile";
import RootPage from "./components/RootPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Products /> },
            {
                path: "home",
                element: <Products />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "logout",
                element: (
                    <ProtectedRoute>
                        <Logout />
                    </ProtectedRoute>
                ),
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "products/:id",
                element: <Product />,
            },
            {
                path: "products/create",
                element: (
                    <ProtectedRoute>
                        <ProductForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users",
                element: (
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users/:id",
                element: <User />,
            },
            {
                path: "signup",
                element: <SignUp />,
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
export default router;
