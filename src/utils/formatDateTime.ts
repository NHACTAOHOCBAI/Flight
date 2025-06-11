import { format } from "date-fns";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }
    return format(date, 'MMM dd, yyyy');
}
const formatTime = (timeString: string): string => {
    const parts = timeString.split(':');
    if (parts.length !== 3) {
        return 'Giờ không hợp lệ';
    }

    const [hh, mm] = parts;
    const hour = Number(hh);
    const minute = Number(mm);

    if (
        isNaN(hour) || isNaN(minute) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59
    ) {
        return 'Giờ không hợp lệ';
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const hhFormatted = String(hour12).padStart(2, '0');
    const mmFormatted = String(minute).padStart(2, '0');

    return `${hhFormatted}:${mmFormatted} ${period}`;
};
export { formatDate, formatTime };