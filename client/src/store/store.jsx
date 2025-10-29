import { configureStore } from '@reduxjs/toolkit';
import userSlice from './UserSlice';

import FileSlice from './FileSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,

    files: FileSlice,
  },
});
