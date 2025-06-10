import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface ParamsState {
    params: Parameter
}
const initialState: ParamsState = {
    params: {
        maxInterQuantity: 0,
        minFlightTime: 0,
        minStopTime: 0,
        maxFlightTime: 0,
        latestBookingDay: 0,
        latestCancelDay: 0,
        maxStopTime: 0,
    }
}

const paramsSilce = createSlice({
    name: 'parameters',
    initialState,
    reducers: {
        setParams(state, action: PayloadAction<Parameter>) {
            state.params = action.payload
            console.log('state', state)
        },
    },
})

export const { setParams } = paramsSilce.actions
export default paramsSilce.reducer

