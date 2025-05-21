import { useEffect, useState } from "react";
import Unauthorized from "../pages/errors/Unauthorized";
import { Outlet, useLocation, useNavigate } from "react-router";
import checkAuth from "./auth";
import { Spin } from "antd";

export default function ProtectedRoute() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(true); // thêm biến loading độc lập

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const validate = async () => {
            setChecking(true);
            const allowed = await checkAuth(location.pathname);
            setIsAuthorized(allowed);
            setChecking(false);
        };

        validate();
    }, [location.pathname, navigate]);

    if (checking) {
        return (
            <div className="flex h-full w-full justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isAuthorized === false) return <Unauthorized />;

    return <Outlet key={location.pathname} />;
}
