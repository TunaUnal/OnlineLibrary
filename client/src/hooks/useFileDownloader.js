import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { downloadFile, clearError } from '../store/FileSlice';

/**
 * Dosya indirme mantığını, durum takibini ve bildirimleri yöneten özel bir hook.
 */
export const useFileDownloader = () => {
  const dispatch = useDispatch();

  // Redux state'inden sadece indirme ile ilgili durumları seçiyoruz.
  const { status, errors } = useSelector((state) => state.files);
  
  const isLoading = status.downloadingFile === 'loading';
  const error = errors.downloadError;

  // Hata durumunu izleyen useEffect.
  // Bu hook'u kullanan herhangi bir component artık bu mantığı tekrar yazmak zorunda değil.
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'İndirme Başarısız',
        text: error,
      });
      // Hatayı gösterdikten sonra state'i temizliyoruz.
      dispatch(clearError('downloadFile'));
    }
  }, [error, dispatch]);

  /**
   * Belirtilen ID'ye sahip dosyayı indirme işlemini tetikler.
   * @param {number} fileId İndirilecek dosyanın ID'si.
   */
  const triggerDownload = (fileId) => {
    // Eğer zaten bir indirme işlemi devam ediyorsa, yenisini başlatma.
    if (isLoading) {
      return;
    }
    dispatch(downloadFile(fileId));
  };

  // Bu hook'u kullanan component'lere bir fonksiyon ve bir durum bilgisi döndürüyoruz.
  return {
    triggerDownload, // İndirmeyi başlatacak fonksiyon
    isLoading,       // İndirme durumunu belirten boolean
  };
};