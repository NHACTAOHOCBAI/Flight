import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
interface RoleState {
    roles: Role
}

const initialState: RoleState = {
    roles: {
        id: 0,
        roleName: "",
        pages: []
    }
}

const roleSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setRoles(state, action: PayloadAction<Role>) {
            state.roles = action.payload
        },
    },
})

export const { setRoles } = roleSlice.actions
export default roleSlice.reducer
