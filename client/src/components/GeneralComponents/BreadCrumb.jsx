import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Navigasyon breadcrumb'ı. Mevcut yolu gösterir ve geri dönme işlevi sağlar.
 * @param {string} currentPageName - Mevcut sayfanın başlığı.
 */
function Breadcrumb({ currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Mevcut yolun parçalarını alıyoruz (örn: /mintika/list -> ["mintika", "list"])
  // Baştaki '/' işaretini kaldırıp boş yolları temizliyoruz.
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');

  // Sayfanın adını geçmişe göre belirle (en son segment)
  // Eğer segment yoksa (anasayfa gibi), varsayılan olarak 'Ana Sayfa' kullan
  const pageTitle =
    currentPageName ||
    (pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1].slice(1)
      : 'Ana Sayfa');

  // Geri dönme işlevi
  const goBack = () => {
    // Genellikle son segmenti kaldırarak bir üst yola gidilir.
    // Örn: /mintika/list'ten /mintika/'ya, /vehicles/4'ten /vehicles/'e
    const segments = location.pathname.split('/').filter((s) => s !== '');
    if (segments.length > 0) {
      const previousPath = segments.slice(0, -1).join('/') || '/'; // Eğer ilk segmente gelirse anasayfaya git
      navigate(`/${previousPath}`);
    } else {
      navigate('/'); // Eğer zaten ana sayfaysa, ana sayfaya git
    }
  };

  return (
    <div className="pagetitle">
      <h1>{currentPageName || 'Sayfa'}</h1>
      <nav>
        <ol className="breadcrumb align-items-center">
          {/* Geri butonu */}
          <li className="breadcrumb-item" onClick={goBack} style={{ cursor: 'pointer' }}>
            <i className="bi bi-arrow-left-circle-fill me-1"></i> Geri
          </li>

          {/* Dinamik olarak breadcrumb segmentleri */}
          {pathSegments.length > 0 && <li className="breadcrumb-item active">{pageTitle}</li>}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
