import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
interface User {
    id?: number;
    username?: string;
    fullName?: string;
    phone?: string;
    avatar?: string | null;
    role?: string | null;
    permissions?: string[];
}
interface UserState {
    user: User
    isLoggedIn: boolean
}

const initialState: UserState = {
    user: {},
    isLoggedIn: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.user = action.payload
            state.isLoggedIn = true
        },
        logout(state) {
            state.user = {}
            state.isLoggedIn = false
        },
    },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
