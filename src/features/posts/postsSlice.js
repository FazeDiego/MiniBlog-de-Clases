// src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//Estado global inicial
const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ----------- Thunk para GET -----------
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10'
    );
    if (!response.ok) {
      throw new Error('Error al obtener publicaciones');
    }
    const data = await response.json();
    return data;
  }
);

// Thunk para POST
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (newPost) => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }
    );
    if (!response.ok) {
      throw new Error('Error al crear la publicación');
    }
    const data = await response.json();
    return data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // obtener posts (GET)
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Se ordenan los posts, los nuevos al inicio
        state.items = action.payload.reverse();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
          // crear post (POST)
      .addCase(addPost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newPost = {
          ...action.payload,
          id: action.payload.id || Date.now(),
        };
        // Inserta el nuevo post al inicio del array
        state.items.unshift(newPost);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
