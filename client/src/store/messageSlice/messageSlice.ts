import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMessage } from '../../interfaces/IMessage';
import axios, { AxiosError } from 'axios';

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
    async (data: { roomId: string, limit: number }) => {
        try {
            const responce = await axios.get<IMessage[]>(`/api/messages/${data.roomId}?&limit=${data.limit}`);
            return responce.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
        }
    },
)

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        createMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages = [...state.messages, action.payload];
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
    }
});

export default messageSlice.reducer;
export const { createMessage } = messageSlice.actions;