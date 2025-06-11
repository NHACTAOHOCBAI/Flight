const hasPermission = (module: string, method: string) => {
    const roles: Role = JSON.parse(localStorage.getItem("permission") || "{}");
    const permittedPages = roles?.pages || [];
    return permittedPages.some((p) => p.module === module && p.method === method);
}
export { hasPermission }