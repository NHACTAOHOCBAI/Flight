const checkAuth = (pathname: string) => {
    // buoc nay lay page tu account duoc luu trong context
    const permittedPages = ['', 'cities', 'airlines', 'flights'];
    //

    const endpoints = pathname.split('/').pop() as string;
    if (permittedPages.includes(endpoints))
        return true;
    return false;
}
export default checkAuth;