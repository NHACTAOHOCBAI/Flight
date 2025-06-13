import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../features/user/userSlide'
import roleReducer from '../features/role/roleSlide'
import paramsReducer from '../features/params/paramsSlide'
import flightReducer from '../features/flight/flightSlide'
export const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
        params: paramsReducer,
        flight: flightReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
