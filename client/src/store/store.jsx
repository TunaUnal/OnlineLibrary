import { configureStore } from '@reduxjs/toolkit';
import userSlice from './UserSlice';
import MainSlice from './MainSlice';
import FileSlice from './FileSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,
    main: MainSlice,
    files: FileSlice,
  },
});
