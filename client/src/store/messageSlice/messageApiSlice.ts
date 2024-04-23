import { IMessage } from "../../interfaces/IMessage";
import { apiSlice } from "../apiSlice";

const BASE_URL = '/api/messages';

// interface IRequestMessageData {
//     roomId: string,
//     text: string,
//     content: any
// }

export const roomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<IMessage[], string>({
            query: (roomId) => `${BASE_URL}/${roomId}`,
        }),
        createMessage: builder.mutation<IMessage, any>({
            query: (formData) => ({
                url: `${BASE_URL}/create`,
                method: 'POST',
                body: formData
            }),
        })
    })
});

export const { useGetMessagesQuery, useCreateMessageMutation } = roomApiSlice;