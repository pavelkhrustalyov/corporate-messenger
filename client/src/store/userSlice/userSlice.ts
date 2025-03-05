 import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';
import axios, { AxiosError } from 'axios';
import { Position } from '../../types/types';

interface IState {
    user: IUser | null;
    users: IUser[];
    isLoading: boolean;
    isError: boolean;
};

const initialState: IState = {
    user: null,
    users: [],
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

export const verifyUser = createAsyncThunk(
    'users/verifyUser',
    async (userId: string) => {
        try {
            await axios.patch<string>(`/api/admin/verify/${userId}`);
            return userId;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const unverifyUser = createAsyncThunk(
    'users/unverifyUser',
    async (userId: string) => {
        try {
            await axios.delete<string>(`/api/admin/unverify/${userId}`);
            return userId;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const updatePosition = createAsyncThunk(
    'users/updatePosition',
    async ({ userId, position }: { userId: string, position: Position }) => {
        try {
            await axios.patch<string>(`/api/admin/update-position/${userId}`, { position });
            return { userId, position };
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
    reducers: {
        addUser: (state, action: PayloadAction<IUser>) => {
            if (action.payload) {
                state.users = [action.payload, ...state.users]
            }
        }
    },

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

        // verifyUser
        builder.addCase(verifyUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.users = state.users.map((user) => {
                    if (user._id === action.payload) {
                        return { ...user, isVerified: true }
                    } else {
                        return user;
                    }
                })
            }
        });

        builder.addCase(unverifyUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.users = state.users.map((user) => {
                    if (user._id === action.payload) {
                        return { ...user, isVerified: false }
                    } else {
                        return user;
                    }
                })
            }
        });

        builder.addCase(updatePosition.fulfilled, (state, action: PayloadAction<{ userId: string, position: Position } | undefined>) => {
            if (action.payload && action.payload.userId && action.payload.position) {
                state.users = state.users.map((user) => {
                    if (user._id === action.payload?.userId) {
                        return { ...user, position: action.payload?.position }
                    } else {
                        return user;
                    }
                })
            }
        });

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
export const { addUser } = userSlice.actions;




