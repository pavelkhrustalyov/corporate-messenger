import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from '../../interfaces/IRoom';
// import { RootState } from '../store';

interface IInitialState {
    roomList: IRoom[] | [],
}

const initialState: IInitialState = {
    roomList: [],
}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        getRooms: (state, action: PayloadAction<IRoom[]>) => {
            state.roomList = action.payload;
        }
    }
})

export default roomSlice.reducer;
export const { getRooms } = roomSlice.actions;