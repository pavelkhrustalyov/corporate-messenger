import axios, { AxiosError } from 'axios';
import { AppDispatch } from '../store';
import { closeGroupChatModal, closePrivateChatModal, closeRoomDataModal, closeVideoChatModal } from '../modalSlice/modalSlice';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';
import { TypeRoom } from '../../types/types';

const BASE_URL = '/api/room';

interface IRoomCreateData {
    title?: string;
    type: TypeRoom;
    users: string[];
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
                dispatch(closeVideoChatModal())
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

export const archiveRoom = createAsyncThunk(
    'rooms/archiveRoom',
    async (roomId: string) => {
        try {
            const responce = await axios.post(`${BASE_URL}/archive/${roomId}`);
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

export const unarchiveRoom = createAsyncThunk(
    'rooms/unarchiveRoom',
    async (roomId: string) => {
        try {
            const responce = await axios.post(`${BASE_URL}/unarchive/${roomId}`);
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


export const updateRoomImage = createAsyncThunk(
    'rooms/updateRoomImage',
    async ({ roomId, formData }: { roomId: string, formData: FormData }) => {
        try {
            const responce = await axios.patch(`${BASE_URL}/${roomId}/upload`, formData);
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