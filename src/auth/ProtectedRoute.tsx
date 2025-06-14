// ProtectedRoute.tsx

import { Outlet } from "react-router";
import Unauthorized from "../pages/errors/Unauthorized";
import { checkPermission } from "../utils/checkPermission";
interface ProtectedRouteProps {
    permissionToCheck?: string; // quyền cụ thể cần kiểm tra (nếu có)
}

const ProtectedRoute = ({ permissionToCheck }: ProtectedRouteProps) => {
    console.log(permissionToCheck)

    if (!permissionToCheck)
        return <Outlet />;
    if (!checkPermission(permissionToCheck)) {
        return <Unauthorized />
    }

    return <Outlet />;
};

export default ProtectedRoute;
