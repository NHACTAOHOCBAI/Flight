import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCity, deleteCity, fetchAllCities, updateCity } from "../services/city"
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
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all cities'] });
            context?.onSettled?.();
        },
    });
}

export const useUpdateCity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCity,
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all cities'] });
            context?.onSettled?.();
        },
    });
}

export const useDeleteCity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCity,
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all cities'] });
            context?.onSettled?.();
        },
    });
}