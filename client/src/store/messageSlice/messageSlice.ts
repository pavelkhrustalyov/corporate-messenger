import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IMessage } from '../../interfaces/IMessage';

interface IInitialState {
    messages: IMessage[];
}

const initialState: IInitialState = {
    messages: []
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
        },
        createMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages = [...state.messages, action.payload];
        }
    },
});

export default messageSlice.reducer;
export const { getMessages, createMessage } = messageSlice.actions;
