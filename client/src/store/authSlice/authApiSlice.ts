import { IUser } from "../../interfaces/IUser";
import { apiSlice } from "../apiSlice";

const BASE_URL = '/api/auth';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest extends LoginRequest {
    name: string;
    surname: string;
    patronymic: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        login: builder.mutation<IUser, LoginRequest>({
            query: (data) => ({
                url: `${BASE_URL}/login`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        register: builder.mutation<void, RegisterRequest>({
            query: (data) => ({
                url: `${BASE_URL}/register`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        loadUser: builder.query<IUser, void>({
            query: () => `${BASE_URL}/me`
        }),
        logout: builder.mutation<void, void>({
            query: () => `${BASE_URL}/logout`,
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLoadUserQuery,
    useLogoutMutation } = authApiSlice;
