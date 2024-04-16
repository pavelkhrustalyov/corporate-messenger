import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';
import { RootState } from '../store';

interface IState {
    user: IUser | null 
};

const currentUser = localStorage.getItem('user');

const initialState: IState = {
    user: currentUser ? JSON.parse(currentUser) : null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
});

export default authSlice.reducer;
export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;




