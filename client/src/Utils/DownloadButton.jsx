import React from 'react';
import { useFileDownloader } from '../hooks/useFileDownloader';

// Örnek bir indirme ikonu. Kendi ikon kütüphanenizi (FontAwesome, Material Icons vb.) kullanabilirsiniz.
const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

/**
 * Farklı varyasyonları destekleyen, yeniden kullanılabilir dosya indirme butonu.
 * @param {object} props
 * @param {number} props.fileId - İndirilecek dosyanın ID'si.
 * @param {'default' | 'icon'} [props.variant='default'] - Butonun görünüm türü.
 * @param {React.ReactNode} [props.children] - Buton içinde gösterilecek özel metin veya ikon.
 * @param {string} [props.className] - Butona eklenecek ekstra CSS sınıfları.
 */
const DownloadButton = ({ fileId, variant = 'default', children, className, ...rest }) => {
  const { triggerDownload, isLoading } = useFileDownloader();

  // --- Ikon Varyasyonu ---
  if (variant === 'icon') {
    return (
      <button
        onClick={() => triggerDownload(fileId)}
        disabled={isLoading}
        className={`btn btn-sm btn-primary mx-2 ${className || ''}`} // Stil için özel class
        title="İndir" // Erişilebilirlik için
        {...rest} // Diğer tüm props'ları (style vb.) butona aktar
      >
        {
          isLoading ? (
            <span className="spinner-icon"></span> // Yükleniyor durumu için küçük bir spinner
          ) : (
            children || <i className="bi bi-cloud-download"></i> // Dışarıdan bir ikon verilmezse varsayılanı kullan
          ) // Dışarıdan bir ikon verilmezse varsayılanı kullan
        }
      </button>
    );
  }

  // --- Varsayılan Metinli Buton Varyasyonu ---
  return (
    <button
      onClick={() => triggerDownload(fileId)}
      disabled={isLoading}
      className={`btn btn-sm btn-primary mx-2 ${className || ''}`}
      {...rest}
    >
      {
        isLoading ? 'İndiriliyor...' : children || 'İndir' // Dışarıdan metin verilmezse varsayılanı kullan
      }
    </button>
  );
};

export default DownloadButton;
