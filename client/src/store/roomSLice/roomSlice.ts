import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';

import {
    getRoomById,
    createRoom,
    getRooms,
    inviteToGroupRoom,
    kickOutOfGroup,
    leaveRoom,
    archiveRoom,
    unarchiveRoom
} from './roomAsync';


interface IInitialState {
    roomList: IRoom[] | [];
    room: IRoom | null;
    isLoading: boolean;
    isError: boolean;
}

const initialState: IInitialState = {
    roomList: [],
    room: null,
    isLoading: false,
    isError: false
}

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

        deleteRoom: (state, action: PayloadAction<string>) => {
            state.roomList = state.roomList.filter(room => room._id !== action.payload);
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

        updateRoomImageUI: (state, action: PayloadAction<IRoom>) => {
            state.roomList = state.roomList.map(room => {
                if (room._id === action.payload._id) {
                    return { ...room, imageGroup: action.payload.imageGroup };
                }
                return room;
            });
            if (state.room?._id === action.payload._id) {
                state.room = { ...state.room, imageGroup: action.payload.imageGroup }
            }
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
            if (action.payload) {
                state.roomList = action.payload;
            }
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

        // archive / unarchived users
        builder.addCase(archiveRoom.fulfilled, (state, action: PayloadAction<IRoom>) => {
            state.roomList = state.roomList.map(room => {
                if (room._id === action.payload._id) {
                    return { ...room, archivedUsers: action.payload.archivedUsers };
                }
                return room;
            });
        });

        builder.addCase(unarchiveRoom.fulfilled, (state, action: PayloadAction<IRoom>) => {
            state.roomList = state.roomList.map(room => {
                if (room._id === action.payload._id) {
                    return { ...room, archivedUsers: action.payload.archivedUsers };
                }
                return room;
            });
        });

        builder.addCase(leaveRoom.fulfilled, (state, action: PayloadAction<string>) => {
            state.roomList = state.roomList.filter(room => room._id !== action.payload);
        })
    }
})

export default roomSlice.reducer;

export const {
    updateRoom,
    updateStatusInRooms,
    addRoom,
    updateStatusInRoom,
    setRoom,
    deleteRoom,
    updateRoomImageUI
} = roomSlice.actions;

export {
    getRoomById,
    createRoom,
    getRooms,
    inviteToGroupRoom,
    kickOutOfGroup,
    leaveRoom,
    archiveRoom,
    unarchiveRoom,
};