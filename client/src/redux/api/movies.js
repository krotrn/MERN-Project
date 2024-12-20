import { apiSlice } from "./apiSlice.js";
import { MOVIE_URL, UPLOAD_URL } from "../constants.js";

export const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new movie
    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: `${MOVIE_URL}/create-movie`,
        method: "POST",
        body: newMovie,
      }),
      invalidatesTags: ["Movies"], // Invalidate the movies cache after creation
    }),

    // Get all movies with filters, pagination, and sorting
    getAllMovies: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        year,
        genre,
      }) => {
        const params = new URLSearchParams({ page, limit, sort, order });
        if (year) params.append("year", year);
        if (genre) params.append("genre", genre);

        return `${MOVIE_URL}?${params.toString()}`;
      },
      providesTags: ["Movies"], // Cache the movies data
    }),

    // Get a specific movie by ID
    getSpecificMovie: builder.query({
      query: (id) => ({
        url: `${MOVIE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Movies", id }], // Cache specific movie data
    }),

    // Update an existing movie
    updateMovie: builder.mutation({
      query: ({ id, updatedMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: "PUT",
        body: updatedMovie,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Movies", id }], // Invalidate the specific movie cache
    }),

    // Add a review to a movie
    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Movies", id }], // Invalidate the specific movie cache
    }),

    // Delete a movie
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movies"], // Invalidate the movies cache
    }),

    // Delete a review from a movie
    deleteReview: builder.mutation({
      query: ({ id, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment/${id}`,
        method: "DELETE",
        body: { reviewId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Movies", id }], // Invalidate the specific movie cache
    }),

    // Fetch new movies
    getNewMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/new-movies`,
        method: "GET",
      }),
      providesTags: ["Movies"], // Cache the new movies data
    }),

    // Fetch top-rated movies
    getTopMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/top-movies`,
        method: "GET",
      }),
      providesTags: ["Movies"], // Cache the top movies data
    }),

    // Fetch random movies
    getRandomMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/random-movies`,
        method: "GET",
      }),
      providesTags: ["Movies"], // Cache the random movies data
    }),

    // Upload an image
    uploadImage: builder.mutation({
      query: (file) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: file,
      }),
    }),
  }),
});

export const {
  useCreateMovieMutation,
  useGetAllMoviesQuery,
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useAddMovieReviewMutation,
  useDeleteMovieMutation,
  useDeleteReviewMutation,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
  useUploadImageMutation,
} = movieApiSlice;
