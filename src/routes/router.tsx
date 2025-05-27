import { createBrowserRouter } from "react-router";
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

import FlightSearchPage from "../pages/customer/SearchFlight";
import RegisterSuccess from "../pages/auth/ConfirmEmail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <FlightSearchPage />,
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
        path: '/booking',
        element: <div className="p-[20px]">
            <Booking />
        </div>
    },
    {
        path: "/admin",
        element: < AdminLayout />,
        children: [
            {
                path: "",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    { path: "accounts", element: <Accounts /> },
                    { path: "airlines", element: <Airlines /> },
                    { path: "airports", element: <Airports /> },
                    { path: "cities", element: <Cities /> },
                    { path: "flights", element: <Flights /> },
                    { path: "planes", element: <Planes /> },
                    { path: "roles", element: <Roles /> },
                    { path: "seats", element: <Seats /> },
                    { path: "setting", element: <Setting /> },
                    { path: "booking", element: <Booking /> },
                    { path: "tickets", element: <Tickets /> },
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

