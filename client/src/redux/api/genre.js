import { apiSlice } from "./apiSlice";
import { GENRE_URL } from "../constants";

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation: Create a new genre
    createGenre: builder.mutation({
      query: (newGenre) => ({
        url: `${GENRE_URL}`,
        method: "POST",
        body: newGenre,
      }),
      invalidatesTags: ["Genres"], // Invalidate cache for genre list
    }),

    // Mutation: Update an existing genre
    updateGenre: builder.mutation({
      query: ({ id, updatedGenre }) => ({
        url: `${GENRE_URL}/${id}`,
        method: "PUT",
        body: updatedGenre,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Genres", id }], // Invalidate cache for the specific genre
    }),

    // Mutation: Delete a genre
    deleteGenre: builder.mutation({
      query: ( {id} ) => ({
        url: `${GENRE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Genres", id }], // Invalidate cache for the specific genre
    }),

    // Query: Fetch all genres
    fetchGenres: builder.query({
      query: () => ({
        url: `${GENRE_URL}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Genres", id: _id })), // Cache each genre
              { type: "Genres", id: "LIST" },
            ]
          : [{ type: "Genres", id: "LIST" }], // Cache genre list
    }),

    // Query: Fetch a single genre by ID
    fetchOneGenre: builder.query({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Genres", id }], // Cache specific genre
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenresQuery,
  useFetchOneGenreQuery,
} = genreApiSlice;
