 import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';
import axios, { AxiosError } from 'axios';

interface IState {
    user: IUser | null;
    users: IUser[] | null;
    isLoading: boolean;
    isError: boolean;
};

const initialState: IState = {
    user: null,
    users: null,
    isLoading: false,
    isError: false
};

export const getUserById = createAsyncThunk(
    'users/getUserById',
    async (userId: string) => {
        try {
            const response = await axios.get<IUser>(`/api/user/${userId}`)
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const getUsers = createAsyncThunk(
    'users/searchUsers',
    async () => {
        try {
            const response = await axios.get<IUser[]>(`/api/user/users`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const searchUsers = createAsyncThunk(
    'users/searchUsers',
    async (query: string) => {
        try {
            const response = await axios.get<IUser[]>(`/api/user/search?query=${query}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(getUserById.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        builder.addCase(getUserById.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
            }
            state.isLoading = false;
            state.isError = false;
        })
        builder.addCase(getUserById.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })

        // search users
        builder.addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        builder.addCase(searchUsers.fulfilled, (state, action) => {
            if (action.payload) {
                state.users = action.payload;
            }
            state.isLoading = false;
            state.isError = false;
        })
        builder.addCase(searchUsers.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
    },
});

export default userSlice.reducer;
export const {} = userSlice.actions;




