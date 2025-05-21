// import { fetchAllRoles } from "../services/role";
import { getUserRoleFromToken } from "../utils/decodeJwt";

// Trả về một Promise<boolean>
const checkAuth = async (pathname: string): Promise<boolean> => {
    try {
        const role = getUserRoleFromToken(); // ví dụ: "ROLE_USER" hoặc "ROLE_ADMIN"
        if (!role) return false;
        const endpoint = pathname.split('/').pop(); // lấy phần sau cùng của URL, vd: 'dashboard'

        if (!endpoint) return false;
        if (endpoint === 'admin') return true; // trang gốc admin thì cho phép

        // const response = await fetchAllRoles();
        const roles: Role[] = [
            {
                id: 9,
                roleName: "USER",
                pages: [
                    {
                        id: 1,
                        pageName: "airlines"
                    },
                    {
                        id: 2,
                        pageName: "accounts"
                    },
                    {
                        id: 3,
                        pageName: "roles"
                    },
                ]
            }
        ]
        console.log(role)
        const currentRole = roles.find((r: Role) => `ROLE_${r.roleName.toUpperCase()}` === role);

        console.log(currentRole)
        if (!currentRole) return false;

        // kiểm tra xem role này có quyền với page hiện tại không
        const hasAccess = currentRole.pages.some((page: { id: number, pageName: string }) => page.pageName === endpoint);

        return hasAccess;
    } catch (err) {
        console.error("Error in checkAuth:", err);
        return false;
    }
};

export default checkAuth;
