import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCity, fetchAllCities } from "../services/city"
export const useGetAllCities = () => {
    return useQuery({
        queryKey: ['get all cities'],
        queryFn: fetchAllCities
    })
}

export const useCreateCity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get all cities'] });
        },
    });
}