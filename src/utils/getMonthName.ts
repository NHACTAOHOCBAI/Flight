const getMonthName = (month: number): string => {
    const monthNames = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];
    return monthNames[month - 1];
};
export default getMonthName