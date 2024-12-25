import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./features/auth/authSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import moviesReducer from "./features/movies/moviesSlice.js";

// Create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication state
    [apiSlice.reducerPath]: apiSlice.reducer, // API slice for caching
    movies: moviesReducer, // Movies state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // Enable Redux DevTools
});

// Enable automatic refetching for API queries
setupListeners(store.dispatch);

export default store;
