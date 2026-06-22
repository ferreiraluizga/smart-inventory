import { Link, Routes, Route } from "react-router-dom";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {

    return (
        <Routes>

            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />

        </Routes>
    );
}