import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMessage } from '../../interfaces/IMessage';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';


const BASE_URL = '/api/messages';

interface IInitialState {
    messages: IMessage[];
    isLoading: boolean,
    isError: boolean,
}

const initialState: IInitialState = {
    messages: [],
    isLoading: false,
    isError: false,
}

export const getMessages = createAsyncThunk(
    'messages/getMessageByRoomId',
    async (data: { roomId: string, limit: number | null }) => {
        try {
            const responce = await axios.get<IMessage[]>(`${BASE_URL}/${data.roomId}?&limit=${data.limit}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
        }
    },
)

export const readMessages = createAsyncThunk(
    'messages/readMessages',
    async (roomId: string) => {
        try {
            const responce = await axios.patch<IMessage[]>(`${BASE_URL}/read-messages/${roomId}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            } else {
                console.log(error)
            }
        }
    },
)


type PayloadStatusData = {
    status: 'Online' | 'Offline';
    userId: string;
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        createMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages = [...state.messages, action.payload];
        },
        updateMessages: (state, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
        },
        updateMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages = state.messages.map(message => {
                if (message._id === action.payload._id) {
                    return { ...message, isRead: true }
                }
                return message;
            })
        },
        updateStatusInMessage: (state, action: PayloadAction<PayloadStatusData>) => {
            state.messages = state.messages.map(message => {
                if (message.senderId._id === action.payload.userId) {
                    return { ...message, senderId: { ...message.senderId, status: action.payload.status }}
                }
                return message;
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, (state) =>   {
            state.isLoading = true;
            state.isError = false;
        });

        builder.addCase(getMessages.fulfilled, (state, action) => {
            if (action.payload) {
                state.messages = action.payload;
            }
            state.isError = false;
            state.isLoading = false;
        });

        builder.addCase(getMessages.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });

        builder.addCase(readMessages.fulfilled, (state) => {
            state.isError = false;
            state.isLoading = false;
        })
    }
});

export default messageSlice.reducer;
export const { createMessage, updateStatusInMessage, updateMessages, updateMessage } = messageSlice.actions;