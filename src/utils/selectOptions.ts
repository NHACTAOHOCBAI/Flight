import { useGetAllAirports } from "../hooks/useAiports";
import { useGetAllAirlines } from "../hooks/useAirlines";
import { useGetAllCities } from "../hooks/useCities";
import { useGetAllFlights } from "../hooks/useFlights";
import { useGetAllPlanes } from "../hooks/usePlanes";
import { useGetAllRoles } from "../hooks/useRoles";
import { useGetAllSeats } from "../hooks/useSeats";

const useSelectOptions = () => {
    const { data: flight } = useGetAllFlights();
    const { data: airlines } = useGetAllAirlines();
    const { data: cities } = useGetAllCities();
    const { data: planes } = useGetAllPlanes();
    const { data: airports } = useGetAllAirports();
    const { data: seats } = useGetAllSeats();
    const { data: roles } = useGetAllRoles();

    const flightSelectOptions = flight?.data?.result?.map((flight: Flight) => ({
        value: flight.id,
        label: flight.flightCode
    })) ?? [];

    const airlineSelectOptions = airlines?.data?.result?.map((airline: Airline) => ({
        value: airline.id,
        label: airline.airlineName
    })) ?? [];

    const citySelectOptions = cities?.data?.result?.map((city: City) => ({
        value: city.id,
        label: city.cityName,
    })) ?? [];

    const planeSelectOptions = planes?.data?.result?.map((plane: Plane) => ({
        value: plane.id,
        label: plane.planeName,
    })) ?? [];

    const airportSelectOptions = airports?.data?.result?.map((airport: Airport) => ({
        value: airport.id,
        label: airport.airportName,
    })) ?? [];

    const seatSelectOptions = seats?.data?.result?.map((seat: Seat) => ({
        value: seat.id,
        label: seat.seatName,
    })) ?? [];

    const roleSelectOptions = roles?.data?.result?.map((role: Role) => ({
        value: role.id,
        label: role.roleName,
    })) ?? [];

    return { airlineSelectOptions, citySelectOptions, planeSelectOptions, airportSelectOptions, seatSelectOptions, roleSelectOptions, flightSelectOptions };
};

export default useSelectOptions;