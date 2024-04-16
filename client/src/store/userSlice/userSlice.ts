 import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';

interface IState {
    user: IUser | null,
    users: IUser[] | null
};

const initialState: IState = {
    user: null,
    users: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer;
export const {} = userSlice.actions;




