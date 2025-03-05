import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { IEditProfile } from '../../interfaces/IEditProfile';

interface IState {
    user: IUser | null 
};

const currentUser = localStorage.getItem('user');

const initialState: IState = {
    user: currentUser ? JSON.parse(currentUser) : null
};

export const updateUser = createAsyncThunk(
    'auth/updateUser', 
    async (userData: IEditProfile) => {
        try {
            const response = await axios.patch<IUser>("/api/user/update", userData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Что-то пошло не так");
            }
        }
    }
)

export const updateAvatar = createAsyncThunk(
    'auth/updateAvatar',
    async (formData: FormData) => {
        try {
            const response = await axios.patch<IUser>(`/api/user/upload`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)


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

    extraReducers: (builder) => {
        builder.addCase(updateUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        })
        builder.addCase(updateAvatar.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        });
    }
});

export default authSlice.reducer;
export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;




