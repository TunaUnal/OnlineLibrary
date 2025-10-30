// src/store/fileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFilesAPI,
  getCategoriesAPI,
  uploadFileAPI,
  getMyFilesAPI,
  downloadFileAPI,
  starCategoryAPI,
  changeFileStatusAPI,
  getPendingFilesAPI,
} from './api';

export const getFiles = createAsyncThunk('files/fetch', async (id, { rejectWithValue }) => {
  try {
    const response = await getFilesAPI(id);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
    }
  }
});

export const getFilesByFilter = createAsyncThunk(
  'files/fetchFiltered',
  async (data, { rejectWithValue }) => {
    try {
      const response = await getFilesAPI(data);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
      }
    }
  }
);

export const getCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesAPI();

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
      }
    }
  }
);

export const uploadFile = createAsyncThunk('file/upload', async (formdata, { rejectWithValue }) => {
  try {
    const response = await uploadFileAPI(formdata);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
    }
  }
});

export const getMyFiles = createAsyncThunk('myFiles/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getMyFilesAPI();
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
    }
  }
});

export const downloadFile = createAsyncThunk('file/download', async (id, { rejectWithValue }) => {
  try {
    const response = await downloadFileAPI(id);

    // 1. Content-Disposition başlığını al
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'indirilen-dosya.pdf'; // Varsayılan ad

    if (contentDisposition) {
      // 2. DOĞRU REGEX: Modern "filename*" formatını ara
      const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);

      if (filenameMatch && filenameMatch.length > 1) {
        // 3. Bulunan kodlanmış adı (%C5%9Eubat gibi) normal metne çevir
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Yedek olarak, eski formatı da kontrol edebiliriz (çok gerek olmasa da)
        const fallbackMatch = contentDisposition.match(/filename="(.+)"/i);
        if (fallbackMatch && fallbackMatch.length > 1) {
          filename = fallbackMatch[1];
        }
      }
    }
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;

    // 5. Düzeltilmiş dosya adını ata
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();

    // 6. Temizlik yap
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { filename }; // Başarılı, reducer'a bilgi ver
  } catch (error) {
    // ... hata yönetimi kodunuz aynı kalabilir ...
    if (error.response && error.response.data) {
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        return rejectWithValue({ message: errorJson.message || 'Dosya indirilemedi.' });
      } catch (e) {
        return rejectWithValue({ message: 'Dosya indirilemedi ve hata mesajı okunamadı.' });
      }
    } else {
      return rejectWithValue({ message: 'Ağ hatası oluştu.' });
    }
  }
});

export const starCategory = createAsyncThunk('category/star', async (id, { rejectWithValue }) => {
  try {
    const response = await starCategoryAPI(id);

    if (response.data.success) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: 'Beklenmedik bir ağ hatası oluştu.' });
    }
  }
});

export const getCategoryRequests = createAsyncThunk('categoryRequest/fetch', async () => {
  const res = await axios.post(
    'http://localhost/server2/api/index.php',
    { type: 'getCategoryRequest' },
    {
      withCredentials: true,
    }
  );
  return res.data;
});

export const getAllFiles = createAsyncThunk('allfiles/fetch', async () => {
  const res = await axios.post(
    'http://localhost/server2/api/index.php',
    { type: 'getAllFiles' },
    {
      withCredentials: true,
    }
  );
  return res.data;
});

export const changeFileStatus = createAsyncThunk(
  'files/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await changeFileStatusAPI(id, status);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFile = createAsyncThunk('files/updateFile', async (payload, thunkAPI) => {
  try {
    const allowed = ['id', 'status', 'filename', 'description', 'category_id'];
    const data = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    formData.append('type', 'updateFile');

    const res = await axios.post('http://localhost/server2/api/index.php', formData, {
      withCredentials: true,
    });

    if (!res.data.success) {
      return thunkAPI.rejectWithValue(res.data.message);
    }
    return data; // id ve değişen alanları dön
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const createCategories = createAsyncThunk(
  'categories/create',
  async ({ parentId, name }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost/server2/api/index.php',
        { type: 'createCategory', parent_id: parentId, name },
        { withCredentials: true }
      );

      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Kategori eklenemedi');
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategoryRequest = createAsyncThunk(
  'categories/request',
  async ({ parentId, name }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost/server2/api/index.php',
        { type: 'createCategoryRequest', parent_id: parentId, name },
        { withCredentials: true }
      );

      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Kategori talebi alınamadı.');
      }
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPendingFiles = createAsyncThunk(
  'files/getPendingFiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPendingFilesAPI();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const FileSlice = createSlice({
  name: 'files',
  initialState: {
    loading: false,
    files: [],
    categories: [],
    isSubmitting: false,
    myFiles: [],
    loadingMyFiles: false,
    error: null,
    selectedFile: null,
    filteredFiles: [],
    pendingFiles: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 1,
    },

    errors: {
      uploadError: null,
      downloadError: null,
      fetchError: null,
      fetchCategoriesError: null,
      fetchMyFilesError: null,
      starCategoryError: null,
      getFilesByFilterError: null,
    },
    status: {
      downloadingFile: null,
      uploadingFile: null,
      fetchingFiles: null,
      fetchingCategories: null,
      fetchingMyFiles: null,
      starringCategory: null,
      gettingFilesByFilter: null,
    },

    loadings: {
      downloadingFile: null,
      uploadingFile: null,
      fetchingFiles: null,
      fetchingCategories: null,
      fetchingMyFiles: null,
      starringCategory: null,
      gettingFilesByFilter: null,
    },
  },
  reducers: {
    clearError: (state, action) => {
      const errorKey = action.payload; // 'fetchFiles', 'downloadFile' etc.
      if (state.errors[errorKey]) {
        state.errors[errorKey] = null;
        // İlgili status'u da 'idle' a çekebilirsiniz
      }
    },
    clearFilteredFiles: (state) => {
      state.filteredFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFiles.fulfilled, (state, action) => {
        state.error = null;
        state.files = action.payload.data;
      })
      .addCase(getFiles.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(getFilesByFilter.pending, (state) => {
        state.status.fetchingFilteredFiles = 'loading';
        state.errors.fetchFilteredFiles = null;
      })
      .addCase(getFilesByFilter.fulfilled, (state, action) => {
        state.status.fetchingFilteredFiles = 'succeeded';
        // API'den gelen veriyi doğru yerlere yaz.
        state.filteredFiles = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFilesByFilter.rejected, (state, action) => {
        state.status.fetchingFilteredFiles = 'failed';
        state.errors.fetchFilteredFiles = action.payload;
        state.filteredFiles = []; // Hata durumunda listeyi boşalt
        state.pagination.total = 0; // Sayfalamayı sıfırla
      });

    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
        state.error = null;
        state.loading = false;
      })
      .addCase(getCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
    builder.addCase(getPendingFiles.fulfilled, (state, action) => {
      state.error = null;
      state.loading = false;
      state.pendingFiles = action.payload.data;
    });
    builder.addCase(getPendingFiles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPendingFiles.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    builder
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isSubmitting = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(uploadFile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.isSubmitting = false;
      });
    builder
      .addCase(downloadFile.pending, (state) => {
        state.isSubmitting = true; // veya loading gibi bir state
        state.errors.downloadError = null;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.errors.downloadError = null;
        console.log(`${action.payload.filename} başarıyla indirildi.`);
        // State'e dosyanın kendisini KAYDETMİYORUZ.
        // İsterseniz burada bir "başarılı" bildirimi (toast) gösterebilirsiniz.
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors.downloadError =
          action.payload.message || 'Dosya indirilirken bir hata oluştu.';
      });

    builder
      .addCase(starCategory.pending, (state) => {
        state.isSubmitting = true;
        state.errors.starCategoryError = null;
      })
      .addCase(starCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.errors.starCategoryError = null;
        // State'e dosyanın kendisini KAYDETMİYORUZ.
        // İsterseniz burada bir "başarılı" bildirimi (toast) gösterebilirsiniz.
      })
      .addCase(starCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors.starCategoryError =
          action.payload.message || 'Dosya indirilirken bir hata oluştu.';
      });

    builder
      .addCase(getMyFiles.fulfilled, (state, action) => {
        state.error = null;
        state.loadingMyFiles = false;
        state.myFiles = action.payload.data;
        state.isSubmitting = false;
      })
      .addCase(getMyFiles.pending, (state, action) => {
        state.loadingMyFiles = true;
      })
      .addCase(getMyFiles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loadingMyFiles = false;
        state.isSubmitting = false;
      });
  },
});

export default FileSlice.reducer;
export const { clearError, clearFilteredFiles } = FileSlice.actions;
