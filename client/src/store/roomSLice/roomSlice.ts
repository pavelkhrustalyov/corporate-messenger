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
    'rooms/getRoomById',
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
interface IStatusPayload {
    payload: {
        userId: string;
        roomId?: string;
        status: "Online" | "Offline";
        last_seen: number
    }
}

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
        },
        updateStatusInRoom: (state, { payload }: IStatusPayload) => {
            if (state.room && state.room._id === payload.roomId) {
                state.room = {
                    ...state.room,
                    participants: state.room.participants.map(p => {
                        if (p._id === payload.userId) {
                            return { ...p, 
                                status: payload.status, 
                                last_seen: payload.last_seen 
                            };
                        } else {
                            return p;
                        }
                    })
                };
            }
        },
        updateStatusInRooms: (state, { payload }: IStatusPayload) => {
            state.roomList = state.roomList.map(room => {
                return { ...room, participants: room.participants.map(p => {
                    if (p._id == payload.userId) {
                        return {...p, status: payload.status}
                    }
                    return p;
                })}
            })
        },
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
export const { getRooms, updateRoom, updateStatusInRooms, updateStatusInRoom } = roomSlice.actions;