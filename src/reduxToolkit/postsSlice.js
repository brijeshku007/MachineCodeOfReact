//steps to perform 
// Set up Redux Toolkit in your project.
// Install the required dependencies:
// npm install @reduxjs/toolkit react-redux
// Create an Async Thunk using createAsyncThunk.
// This function handles the logic of making an API call and managing states like loading, success, or failure.
// Handle the Thunk in a Slice using extraReducers.
// extraReducers allows you to respond to actions created by createAsyncThunk.
// Dispatch the Thunk in your component.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk to fetch posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No need for reducers since we handle everything in extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
