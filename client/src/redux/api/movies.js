import { apiSlice } from "./apiSlice.js";
import { MOVIE_URL, UPLOAD_URL } from "../constants.js";

export const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: `${MOVIE_URL}/create-movie`,
        method: "POST",
        body: newMovie,
      }),
    }),

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

        return `${MOVIE_URL}?${params.toString()}`; // The query string is appended to the URL
      },
    }),

    getSpecificMovie: builder.query({
      query: (id) => ({
        url: `${MOVIE_URL}/${id}`,
        method: "GET",
      }),
    }),

    updateMovie: builder.mutation({
      query: ({ id, updatedMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: "PUT",
        body: updatedMovie,
      }),
    }),

    addMovieReview: builder.mutation({
      query: ({ id, rating, commet }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, commet },
      }),
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: "DELETE",
      }),
    }),

    deleteReview: builder.mutation({
      query: ({ id, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment/${id}`,
        method: "DELETE",
        body: { reviewId },
      }),
    }),

    getNewMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/new-movies`,
        method: "GET",
      }),
    }),

    getTopMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/top-movies`,
        method: "GET",
      }),
    }),

    getRandomMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/random-movies`,
        method: "GET",
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
} = movieApiSlice;
