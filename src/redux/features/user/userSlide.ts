import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
interface User {
    id?: number,
    username?: string,
    password?: string
    name?: string
    phone?: string
    avatar?: string
    roleId?: number
}
interface UserState {
    user: User
    isLoggedIn: boolean
}

const initialState: UserState = {
    user: {
        id: 0,
        username: "",
        password: "",
        name: "",
        phone: "",
        avatar: "",
        roleId: 0
    },
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
            state.user = {
                id: 0,
                username: "",
                password: "",
                name: "",
                phone: "",
                avatar: "",
                roleId: 0
            }
            state.isLoggedIn = false
        },
    },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
