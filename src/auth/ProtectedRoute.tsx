import { Outlet, useLocation } from "react-router";
import checkAuth from "./auth";
import Unauthorized from "../pages/errors/Unauthorized";

export default function ProtectedRoute() {
    const { pathname } = useLocation();
    const isAllowed = checkAuth(pathname)
    if (isAllowed)
        return <Outlet />
    return <Unauthorized />
}
