import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/clients`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    // Get all clients (public)
    getClients: builder.query({
      query: ({ status, search } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        return `?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Client', id: _id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    
    // Get single client (public)
    getClientById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    
    // Create client (admin only)
    createClient: builder.mutation({
      query: (clientData) => ({
        url: '/',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    
    // Update client (admin only)
    updateClient: builder.mutation({
      query: ({ id, ...clientData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: clientData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),
    
    // Delete client (admin only)
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;

