import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl, credentials: 'include', mode: 'cors' }),
    endpoints: (_builder) => ({}),
});