import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';
import axios, { AxiosError } from 'axios';
// import { RootState } from '../store';

interface IInitialState {
    roomList: IRoom[] | [],
    room: IRoom | null,
    isLoading: boolean,
    isError: boolean
}

const initialState: IInitialState = {
    roomList: [],
    room: null,
    isLoading: false,
    isError: false
}

export const getRoomById = createAsyncThunk(
    'messages/getRoomById',
    async (roomId: string) => {
        try {
            const responce = await axios.get<IRoom>(`/api/room/${roomId}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
        }
    },
)

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        getRooms: (state, action: PayloadAction<IRoom[]>) => {
            state.roomList = action.payload;
        },
        updateRoom: (state, { payload }: PayloadAction<IRoom>) => {
            state.roomList = state.roomList.map(room => {
                if (room._id === payload._id) {
                    return { ...payload }
                }
                return room;
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRoomById.pending, (state) =>   {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(getRoomById.fulfilled, (state, action) => {
            if (action.payload) {
                state.room = action.payload;
            }
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(getRoomById.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
})

export default roomSlice.reducer;
export const { getRooms, updateRoom } = roomSlice.actions;