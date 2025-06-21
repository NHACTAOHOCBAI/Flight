import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Accounts from "../pages/admin/Accounts";
import Airlines from "../pages/admin/Airlines";
import Airports from "../pages/admin/Airports";
import Cities from "../pages/admin/Cities";
import Flights from "../pages/admin/Flights";
import Planes from "../pages/admin/Planes";
import Roles from "../pages/admin/Roles";
import Seats from "../pages/admin/Seats";
import Setting from "../pages/admin/Setting";
import Tickets from "../pages/admin/Tickets";
import Login from "../pages/auth/Login";
import Resgister from "../pages/auth/Resgister";
import NotFound from "../pages/errors/NotFound";
import Booking from "../pages/admin/Booking";

import RegisterSuccess from "../pages/auth/ConfirmEmail";
import Profile from "../pages/admin/Profile";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Resgister />
    },
    {
        path: '/register/confirm',
        element: <RegisterSuccess />
    },
    {
        path: '/forget-password',
        element: <ForgetPassword />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    },
    {
        path: "/admin",
        element: <ProtectedRoute />, // bảo vệ toàn bộ admin layout
        children: [
            {
                path: "",
                element: <AdminLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <ProtectedRoute permissionToCheck="View Dashboard" />,
                        children: [{ index: true, element: <Dashboard /> }]
                    },
                    {
                        path: "accounts",
                        element: <ProtectedRoute permissionToCheck="View Account" />,
                        children: [{ index: true, element: <Accounts /> }]
                    },
                    {
                        path: "airlines",
                        element: <ProtectedRoute permissionToCheck="View Airline" />,
                        children: [{ index: true, element: <Airlines /> }]
                    },

                    {
                        path: "airports",
                        element: <ProtectedRoute permissionToCheck="View Airport" />,
                        children: [{ index: true, element: <Airports /> }]
                    },
                    {
                        path: "cities",
                        element: <ProtectedRoute permissionToCheck="View City" />,
                        children: [{ index: true, element: <Cities /> }]
                    },
                    {
                        path: "flights",
                        element: <ProtectedRoute permissionToCheck="View Flight" />,
                        children: [{ index: true, element: <Flights /> }] // Giữ nguyên, không áp dụng mẫu
                    },
                    {
                        path: "planes",
                        element: <ProtectedRoute permissionToCheck="View Plane" />,
                        children: [{ index: true, element: <Planes /> }]
                    },
                    {
                        path: "roles",
                        element: <ProtectedRoute permissionToCheck="View Role" />,
                        children: [{ index: true, element: <Roles /> }]
                    },
                    {
                        path: "seats",
                        element: <ProtectedRoute permissionToCheck="View Seat" />,
                        children: [{ index: true, element: <Seats /> }]
                    },
                    {
                        path: "setting",
                        element: <ProtectedRoute permissionToCheck="View Parameter" />,
                        children: [{ index: true, element: <Setting /> }]
                    },
                    {
                        path: "booking",
                        element: <Booking /> // Giữ nguyên, không áp dụng mẫu
                    },
                    {
                        path: "tickets",
                        element: <ProtectedRoute permissionToCheck="View Ticket" />,
                        children: [{ index: true, element: <Tickets /> }]
                    },
                    {
                        path: "profile",
                        element: <Profile />
                    }
                ]
            }
        ]
    },

    // not found
    {
        path: "*",
        element: <NotFound />,
    },
]);
export default router

