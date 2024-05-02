import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';
import axios, { AxiosError } from 'axios';
import { AppDispatch } from '../store';
import { closeGroupChatModal, closePrivateChatModal, closeRoomDataModal, closeTitleModal } from '../modalSlice/modalSlice';
import { toast } from 'react-toastify';

const BASE_URL = '/api/room';

interface IInitialState {
    roomList: IRoom[] | [];
    room: IRoom | null;
    isLoading: boolean;
    isError: boolean;
}

interface IRoomCreateData {
    title?: string;
    type: "private" | "group";
    users: string[];
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
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    },
)

export const createRoom = createAsyncThunk<IRoom, IRoomCreateData>(
    'rooms/createRoom',
    async (data: IRoomCreateData, thunkAPI) => {
        const dispatch = thunkAPI.dispatch as AppDispatch;
        try {
            const responce = await axios.post(`${BASE_URL}/create-room`, data);
            if (data.type === "private") {
                dispatch(closePrivateChatModal())
            } else {
                dispatch(closeGroupChatModal())
            }
            return responce.data;

        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const getRooms = createAsyncThunk<IRoom[]>(
    'rooms/getRooms',
    async () => {
        try {
            const responce = await axios.get(`${BASE_URL}/rooms`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const inviteToGroupRoom = createAsyncThunk(
    'rooms/inviteToGroupRoom',
    async (data: { roomId: string, participants: string[] }, thunkAPI) => {
        const dispatch = thunkAPI.dispatch as AppDispatch;

        try {
            const responce = await axios.patch(`${BASE_URL}/invite`, data);
            dispatch(closeRoomDataModal());
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const kickOutOfGroup = createAsyncThunk(
    'rooms/kickOutOfGroup',
    async (data: { roomId: string, userId: string }) => {
        try {
            const responce = await axios.patch(`${BASE_URL}/kickOut`, data);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const leaveRoom = createAsyncThunk(
    'rooms/leaveRoom',
    async (roomId: string) => {
        try {
            const responce = await axios.delete(`${BASE_URL}/leave/${roomId}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
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
        addRoom: (state, { payload }: PayloadAction<IRoom>) => {
            if (payload) {
                state.roomList = [...state.roomList, payload];
            }
        },
        updateRoom: (state, { payload }: PayloadAction<IRoom>) => {
            state.roomList = state.roomList.map(room => {
                if (room._id === payload._id) {
                    return { ...payload }
                }
                return room;
            })
        },

        setRoom: (state, action: PayloadAction<IRoom>) => {
            state.room = action.payload;
        },

        updateStatusInRoom: (state, { payload }: IStatusPayload) => {
            const { userId, roomId, status, last_seen } = payload;
            if (state.room && state.room._id === roomId) {
                state.room = {
                    ...state.room,
                    participants: state.room.participants.map(p => {
                        if (p._id === userId) {
                            return { ...p, status, last_seen:last_seen || p.last_seen };
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

        // create room
        builder.addCase(createRoom.pending, (state) =>  {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(createRoom.fulfilled, (state) => {
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(createRoom.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });

        // get rooms
        builder.addCase(getRooms.pending, (state) =>  {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(getRooms.fulfilled, (state, action: PayloadAction<IRoom[]>) => {
            state.roomList = action.payload;
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(getRooms.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });

        // invite to group room
        builder.addCase(inviteToGroupRoom.pending, (state) =>  {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(inviteToGroupRoom.fulfilled, (state) => {
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(inviteToGroupRoom.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
})

export default roomSlice.reducer;

export const { 
    updateRoom,
    updateStatusInRooms,
    addRoom,
    updateStatusInRoom,
    setRoom
} = roomSlice.actions;