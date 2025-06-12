/* eslint-disable @typescript-eslint/no-explicit-any */
interface Role {
    id: number,
    roleName: string,
    roleDescription: string,
    pages: {
        id: number,
        pageName: string,
        module: string,
        method: string
    }[]
}
const hasPermission = (module: string, method: string) => {
    const roles: Role = JSON.parse(localStorage.getItem("permission") || "{}");
    const permittedPages = roles?.pages || [];
    return permittedPages.some((p) => p.module === module && p.method === method);
}
const permissionMap: Record<string, string> = {
    'POST_/accounts/**': 'Create Account',
    'GET_/accounts/**': 'View Account',
    'DELETE_/accounts/**': 'Delete Account',
    'PUT_/accounts/**': 'Update Account',
    'POST_/accounts/**/change-password/**': 'Change Password',

    'POST_/roles/**': 'Create Role',
    'PUT_/roles/**': 'Update Role',
    'GET_/roles/**': 'View Role',
    'DELETE_/roles/**': 'Delete Role',

    'POST_/tickets/**': 'Create Ticket',
    'GET_/tickets/**': 'View Ticket',
    'PUT_/tickets/**': 'Update Ticket',
    'DELETE_/tickets/**': 'Delete Ticket',
    'GET_/tickets/revenue/**': 'Get Total Revenue',
    'GET_/tickets/booking-rate/**': "Get Booking Rate",

    'POST_/seats/**': 'Create Seat',
    'PUT_/seats/**': 'Update Seat',
    'DELETE_/seats/**': 'Delete Seat',

    'POST_/airports/**': 'Create Airport',
    'PUT_/airports/**': 'Update Airport',
    'DELETE_/airports/**': 'Delete Airport',

    'POST_/cities/**': 'Create City',
    'PUT_/cities/**': 'Update City',
    'DELETE_/cities/**': 'Delete City',

    'POST_/airlines/**': 'Create Airline',
    'PUT_/airlines/**': 'Update Airline',
    'DELETE_/airlines/**': 'Delete Airline',

    'POST_/flights/**': 'Create Flight',
    'PUT_/flights/**': 'Update Flight',
    'DELETE_/flights/**': 'Delete Flight',

    'POST_/planes/**': 'Create Plane',
    'PUT_/planes/**': 'Update Plane',
    'DELETE_/planes/**': 'Delete Plane',

    'PUT_/parameters/**': 'Update Parameter',

    'GET_/reports/annual-revenue/**': 'Get Anuual Revenue Report',
    'GET_/reports/monthly-revenue/**/**': 'Get Monthly Revenue Report'
};

function checkPermission(permissionToCheck: string, roles?: Role): boolean {
    let pages = [];
    if (!roles) {
        const roleJson = localStorage.getItem('permission');
        if (!roleJson) return false;
        const role = JSON.parse(roleJson);
        pages = role.pages || [];
    }
    else
        pages = roles.pages
    const permissions = pages.map((page: any) => {
        const key = `${page.method}_${page.apiPath}`;
        return permissionMap[key];
    });
    console.log("pages", JSON.stringify(pages))
    console.log("permissions", (permissions))
    return permissions.includes(permissionToCheck);
}
export { hasPermission, checkPermission }


