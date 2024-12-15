import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation: User login
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate cache for User
    }),

    // Mutation: User registration
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate cache for User
    }),

    // Query: Fetch the logged-in user profile
    getUser: builder.query({
      query: () => `${USER_URL}/profile`,
      providesTags: ["User"], // Cache User profile data
    }),

    // Mutation: User logout
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"], // Invalidate User cache on logout
    }),

    // Mutation: Update user profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate cache for User profile
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = userApiSlice;
