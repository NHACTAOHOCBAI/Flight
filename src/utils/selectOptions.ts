import { useGetAllAirports } from "../hooks/useAiports";
import { useGetAllAirlines } from "../hooks/useAirlines";
import { useGetAllCities } from "../hooks/useCities";
import { useGetAllPlanes } from "../hooks/usePlanes";
import { useGetAllSeats } from "../hooks/useSeats";

const useSelectOptions = () => {
    const { data: airlines } = useGetAllAirlines();
    const { data: cities } = useGetAllCities();
    const { data: planes } = useGetAllPlanes();
    const { data: airports } = useGetAllAirports();
    const { data: seats } = useGetAllSeats();
    const airlineSelectOptions = airlines?.data?.map((airline: Airline) => ({
        value: airline.id,
        label: airline.airlineName
    })) ?? [];

    const citySelectOptions = cities?.data?.map((city: City) => ({
        value: city.id,
        label: city.cityName,
    })) ?? [];

    const planeSelectOptions = planes?.data?.map((plane: Plane) => ({
        value: plane.id,
        label: plane.planeName,
    })) ?? [];

    const airportSelectOptions = airports?.data?.map((airport: Airport) => ({
        value: airport.id,
        label: airport.airportName,
    })) ?? [];

    const seatSelectOptions = seats?.data?.map((seat: Seat) => ({
        value: seat.id,
        label: seat.seatName,
    })) ?? [];
    return { airlineSelectOptions, citySelectOptions, planeSelectOptions, airportSelectOptions, seatSelectOptions };
};

export default useSelectOptions;