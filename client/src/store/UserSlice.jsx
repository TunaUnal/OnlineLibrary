// TODO : USER Slice, Auth Slice ve User Slice olarak 2ye ayrılacak.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginUser, getUsersAPI } from './api';

const initialState = {
  status: !!localStorage.getItem('user'),
  user: !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null,
  error: '',
  redirectPath: null,

  userList: [],

  selectedUser: null,
  loading: false, // Genel yüklenme
  isSubmitting: false, // Form gönderim yüklenmesi
};

export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ error: 'Beklenmedik bir hata oluştu.' });
    }
  }
});

export const getUsers = createAsyncThunk(
  'users/fetchAll', // Action type'ı ('sliceName/thunkName')
  async (_, { rejectWithValue }) => {
    // Argüman almadığı için ilk parametre _
    try {
      const response = await getUsersAPI();

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Kullanıcılar getirilemedi.';
      return rejectWithValue(message);
    }
  }
);

export const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    clearRedirectPath: (state) => {
      state.redirectPath = null;
    },
    logoutUser: (state) => {
      alert('a');
      state.user = null;
      state.status = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.user = action.payload.data;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.user = {};
        // Hata mesajını API'den gelen payload'dan al
        state.error = action.payload?.error || 'Giriş yapılamadı.';
        localStorage.removeItem('user');
      });

    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userList = action.payload.data;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.userList = null;
        state.error = action.payload || 'Kullanıcılar getirilemedi.';
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearSelectedUser, logoutUser } = UserSlice.actions;

export default UserSlice.reducer;
