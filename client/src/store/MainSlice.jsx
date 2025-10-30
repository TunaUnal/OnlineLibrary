import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDashboardDataAPI as dashboard } from './api';
const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
};

export const getDashboardData = createAsyncThunk(
  'dashboard/getData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboard();

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: 'Beklenmedik bir hata oluştu.' });
      }
    }
  }
);

export const MainSlice = createSlice({
  name: 'MainSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.data;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Dashboard verileri alınamadı.';
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = MainSlice.actions;

export default MainSlice.reducer;
