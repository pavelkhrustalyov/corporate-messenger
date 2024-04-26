import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';
import axios, { AxiosError } from 'axios';
// import { RootState } from '../store';

const BASE_URL = '/api/room';

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
            const responce = await axios.get<IRoom>(`${BASE_URL}/${roomId}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
        }
    },
)

export const createPrivateRoom = createAsyncThunk<IRoom, { userId: string, lastMessage: string }>(
    'rooms/createPrivateRoom',
    async (data: { userId: string, lastMessage: string }) => {
        try {
            const responce = await axios.post(`${BASE_URL}/create/${data.userId}`, {
                lastMessage: data.lastMessage
            });
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

interface IStatusPayload {
    payload: {
        userId: string;
        roomId?: string;
        status: "Online" | "Offline";
        last_seen?: number
    }
}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        getRooms: (state, action: PayloadAction<IRoom[]>) => {
            state.roomList = action.payload;
        },
        addRoom: (state, { payload }: PayloadAction<IRoom>) => {
            if (payload) {
                state.roomList.push(payload);
            }
        },
        setRoom: (state, { payload }: PayloadAction<IRoom>) => {
            state.room = payload;
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
            const { userId, roomId, status, last_seen } = payload;
            if (state.room && state.room._id === roomId) {
                state.room = {
                    ...state.room,
                    participants: state.room.participants.map(p => {
                        if (p._id === userId) {
                            return { ...p, status, last_seen };
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

        // create private room
        builder.addCase(createPrivateRoom.pending, (state) =>  {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(createPrivateRoom.fulfilled, (state, action: PayloadAction<IRoom>) => {
            const payload = action.payload as IRoom;
            if (payload) {
                state.roomList.push(payload)
            }
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(createPrivateRoom.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
})

export default roomSlice.reducer;
export const { getRooms, updateRoom, updateStatusInRooms, updateStatusInRoom, setRoom } = roomSlice.actions;