 import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
        console.log(userId)
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
    },
});

export default userSlice.reducer;
export const {} = userSlice.actions;




