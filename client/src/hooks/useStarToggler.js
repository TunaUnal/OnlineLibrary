import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { starCategory, clearError } from '../store/FileSlice';

/**
 * Dosya indirme mantığını, durum takibini ve bildirimleri yöneten özel bir hook.
 */
export const useStarToggler = () => {
  const dispatch = useDispatch();

  // Redux state'inden sadece indirme ile ilgili durumları seçiyoruz.
  const { status, errors } = useSelector((state) => state.files);
  
  const isLoading = status.starringCategory === 'loading';
  const error = errors.starCategoryError;

  // Hata durumunu izleyen useEffect.
  // Bu hook'u kullanan herhangi bir component artık bu mantığı tekrar yazmak zorunda değil.
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Yıldızlama Başarısız',
        text: error,
      });
      dispatch(clearError('starCategoryError'));
    }
  }, [error, dispatch]);

  /**
   * Belirtilen ID'ye sahip klasörü yıldızlama işlemini tetikler.
   * @param {number} categoryID Yıldızlanacak dosyanın ID'si.
   */
  const triggerStar = (categoryID) => {
    // Eğer zaten bir yıldızlama işlemi devam ediyorsa, yenisini başlatma.
    if (isLoading) {
      return;
    }
    dispatch(starCategory(categoryID));
  };

  // Bu hook'u kullanan component'lere bir fonksiyon ve bir durum bilgisi döndürüyoruz.
  return {
    triggerStar,    // İndirmeyi başlatacak fonksiyon
    isLoading,       // İndirme durumunu belirten boolean
  };
};