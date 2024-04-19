import { IRoom } from "../../interfaces/IRoom";
import { apiSlice } from "../apiSlice";

const BASE_URL = '/api/room';

export const roomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query<IRoom[], void>({
            query: () => `${BASE_URL}/rooms`
        })
    })
})

export const { useGetRoomsQuery } = roomApiSlice;