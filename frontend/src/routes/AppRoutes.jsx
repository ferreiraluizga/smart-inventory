import { Link, Routes, Route } from "react-router-dom";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Register from "../pages/Register";
import Marcas from "../pages/marcas/Marcas";
import Categorias from "../pages/categorias/Categorias";
import Fornecedores from "../pages/fornecedores/Fornecedores";

export default function AppRoutes() {

    return (
        <Routes>

            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Welcome />
                    </PublicRoute>
                }
            />

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />

            <Route 
                path="/dashboard/marcas"
                element={
                    <PrivateRoute>
                        <Marcas />
                    </PrivateRoute>
                }
            />

            <Route 
                path="/dashboard/categorias"
                element={
                    <PrivateRoute>
                        <Categorias />
                    </PrivateRoute>
                }
            />

            <Route 
                path="/dashboard/fornecedores"
                element={
                    <PrivateRoute>
                        <Fornecedores />
                    </PrivateRoute>
                }
            />

        </Routes>
    );
}