import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../features/user/userSlide'
import roleReducer from '../features/role/roleSlide'
export const store = configureStore({
    reducer: {
        user: userReducer,
        role: roleReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
