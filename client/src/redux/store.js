import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./features/auth/authSlice.js";
import { apiSlice } from "./api/apiSlice.js";

// Create Redux store
const store = configureStore({
  // Reducer configuration
  reducer: {
    auth: authReducer, // Handles authentication state
    [apiSlice.reducerPath]: apiSlice.reducer, // Manages API caching and state
  },
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // Enable Redux DevTools
});

// Enable automatic refetching for API queries when the focus or connection changes
setupListeners(store.dispatch);

export default store;
