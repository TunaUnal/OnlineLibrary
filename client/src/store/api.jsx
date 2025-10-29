import axios from 'axios';
import qs from 'qs';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user') || '{}')?.token || ''}`, // genelde "Bearer <token>" formatında

    'Content-Type': 'application/json',
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

/**
 * Tüm klasörleri getirir.
 * @params {FormData} data - Yüklenecek dosya formdata'sı
 * @returns {Promise<object>}
 */
export const uploadFileAPI = (formdata) => {
  return apiClient.post('index.php', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * ID'si verilen dosyayı indirmek için API çağrısı yapar.
 * @param {number} id - İndirilecek dosya id'si
 * @returns {Promise<object>} - Axios yanıt nesnesi (içinde blob data olacak)
 */
export const downloadFileAPI = (id) => {
  // Config objesini ikinci parametre olarak veriyoruz.
  return apiClient.get(`download.php?id=${id}`, {
    responseType: 'blob', // Yanıtın ham veri (blob) olduğunu belirtiyoruz.
  });
};

/**
 * ID'si verilen dosyanın durumunu değiştirir (onayla, sil, yeniden onayla).
 * @param {number} id - Durumu değişecek dosya id'si
 * @returns {Promise<object>} - Axios yanıt nesnesi (içinde blob data olacak)
 * */
export const changeFileStatusAPI = (id, status) => {
  // Config objesini ikinci parametre olarak veriyoruz.
  return apiClient.post(`index.php`, {
    id: id,
    type: 'changeFileStatus',
    status: status,
  });
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
