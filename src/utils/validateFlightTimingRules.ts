import dayjs from "dayjs";

interface InterAirportStop {
    airportId?: string;
    departureDate?: dayjs.Dayjs; // thời điểm dừng tại sân bay trung gian
    departureTime?: dayjs.Dayjs; // thời điểm bay tiếp tại sân bay trung gian
    note?: string;
}

interface FlightFormValues {
    departureDate?: dayjs.Dayjs;
    arrivalDate?: dayjs.Dayjs;
    interAirports?: InterAirportStop[];
}

interface TimingRules {
    maxInterAirports: number;        // ví dụ: 3
    maxTotalDurationMinutes: number; // ví dụ: 720 phút (12 giờ)
    minStopMinutes: number;          // ví dụ: 20 phút
    maxStopMinutes: number;          // ví dụ: 120 phút
}

/**
 * Custom validator for flight timing logic.
 */
export const validateFlightRules = (rules: TimingRules) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_: any, allValues: FlightFormValues) => {
        const errors: string[] = [];

        const { departureDate, arrivalDate, interAirports } = allValues;

        // Rule 1: Check departure & arrival existence
        if (!departureDate || !arrivalDate) {
            return Promise.resolve(); // Let individual fields handle this
        }

        const totalDuration = arrivalDate.diff(departureDate, "minute");

        // Rule 2: Total duration limit
        if (totalDuration > rules.maxTotalDurationMinutes) {
            errors.push(`Tổng thời gian bay không được vượt quá ${rules.maxTotalDurationMinutes / 60} giờ.`);
        }

        // Rule 3: Intermediate airport count
        if (interAirports && interAirports.length > rules.maxInterAirports) {
            errors.push(`Tối đa chỉ được phép ${rules.maxInterAirports} sân bay trung gian.`);
        }

        // Rule 4: Each intermediate stop duration
        if (interAirports && Array.isArray(interAirports)) {
            interAirports.forEach((stop, index) => {
                if (!stop.departureDate || !stop.departureTime) return;

                const stopTime = dayjs(stop.departureDate);
                const continueTime = dayjs(stop.departureTime);

                if (!stopTime.isValid() || !continueTime.isValid()) return;

                const stopDuration = continueTime.diff(stopTime, "minute");

                if (stopDuration < rules.minStopMinutes) {
                    errors.push(`Thời gian dừng tại sân bay trung gian thứ ${index + 1} phải ít nhất ${rules.minStopMinutes} phút.`);
                }

                if (stopDuration > rules.maxStopMinutes) {
                    errors.push(`Thời gian dừng tại sân bay trung gian thứ ${index + 1} không được vượt quá ${rules.maxStopMinutes} phút.`);
                }
            });
        }

        return errors.length > 0 ? Promise.reject(errors.join(" ")) : Promise.resolve();
    };
};
