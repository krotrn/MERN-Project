import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moviesFilter: {
    searchTerms: "",
    selectedGenres: "",
    selectedRating: "",
    selectedYear: "",
    selectedSort: "",
  },
  filteredMovies: [], 
  moviesYears: [],
  uniqueYears: [],
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMoviesFilter: (state, action) => {
      state.moviesFilter = { ...state.moviesFilter, ...action.payload };
    },
    setFilterMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },
    setMoviesYear: (state, action) => {
      state.moviesYears = action.payload;
    },
    setUniqueYears: (state, action) => {
      state.uniqueYears = action.payload;
    },
  },
});

export const {
  setMoviesFilter,
  setFilterMovies,
  setMoviesYear,
  setUniqueYears,
} = moviesSlice.actions;

export default moviesSlice.reducer;
