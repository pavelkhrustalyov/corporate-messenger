import { IUser } from "../../interfaces/IUser";
import { LoginForm } from "../../interfaces/LoginForm";
import { RegisterForm } from "../../interfaces/RegisterForm";
import { apiSlice } from "../apiSlice";
const BASE_URL = '/api/auth';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        login: builder.mutation<IUser, LoginForm>({
            query: (data) => ({
                url: `${BASE_URL}/login`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        register: builder.mutation<void, RegisterForm>({
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
