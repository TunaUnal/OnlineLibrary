import axios from 'axios';
import qs from 'qs';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user') || '{}')?.token || ''}`, // genelde "Bearer <token>" formatında
  },
});

//! Kullanıcı girişi yapar.
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

//! Filtreye göre dosyaları getirir.
export const getFilesAPI = (queryParams) => {
  // queryParams objesi şöyle olacak: { page: 1, limit: 10, filter: { user_id: 5 } }
  const queryString = qs.stringify(queryParams);
  // queryString -> "page=1&limit=10&filter[user_id]=5"

  return apiClient.get(`/file?${queryString}`); // endpoint adının 'files' olduğunu varsayıyorum
};

//! Kullanıcının kendi yüklediği dosyaları getirir.
export const getMyFilesAPI = () => apiClient.get('/file/me');

//! Tüm klasörleri getirir.
export const getCategoriesAPI = () => apiClient.get('/category');

//! Dashboard datalarını getirir.
export const getDashboardDataAPI = () => apiClient.get('/main');

//! Onay bekleyen dosyaları getirir.
export const getPendingFilesAPI = () => apiClient.get('/file/pending');

/**
 * Tüm klasörleri getirir.
 * @params {FormData} data - Yüklenecek dosya formdata'sı
 * @returns {Promise<object>}
 */
export const uploadFileAPI = (formdata) => {
  return apiClient.post('/file/upload', formdata);
};

/**
 * ID'si verilen dosyayı indirmek için API çağrısı yapar.
 * @param {number} id - İndirilecek dosya id'si
 * @returns {Promise<object>} - Axios yanıt nesnesi (içinde blob data olacak)
 */
export const downloadFileAPI = (id) =>
  apiClient.get(`/file/download/${id}`, {
    // BU SATIR ÇOK ÖNEMLİ!
    responseType: 'blob',
  });

//! Dosya durumunu değiştirmek için API çağrısı yapar.
export const changeFileStatusAPI = (id, status) => {
  return apiClient.put(`/file/${id}/status`, { status });
};

/**
 * ID'si verilen  klasörü yıldızlar.
 * @param {number} id - Yıldızlanacak klasö id'si
 * @returns {Promise<object>} - Axios yanıt nesnesi (içinde blob data olacak)
 */
export const starCategoryAPI = (id) => {
  return apiClient.post(`index.php`, {
    type: 'starCategory',
    id: id,
  });
};

/**
 * Tüm Kullanıcıları getirir.
 * @returns {Promise<object>} - Axios yanıt nesnesi
 */
export const getUsersAPI = () => {
  return apiClient.get(`/user`);
};
