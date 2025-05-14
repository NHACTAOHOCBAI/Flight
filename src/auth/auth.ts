const checkAuth = (pathname: string) => {
    // buoc nay lay page tu account duoc luu trong context
    const permittedPages = [
        'dashboard',
        'accounts',
        'airlines',
        'airports',
        'cities',
        'flights',
        'planes',
        'roles',
        'seats',
        'setting',
        'tickets',
        'booking'
    ];
    //

    const endpoints = pathname.split('/').pop() as string;
    if (permittedPages.includes(endpoints))
        return true;
    return false;
}
export default checkAuth;