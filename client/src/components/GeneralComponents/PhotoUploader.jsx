import React from 'react';

/**
 * Birden fazla fotoğraf çekmek ve önizlemesini göstermek için yeniden kullanılabilir bir bileşen.
 * @param {File[]} photos - Üst bileşende tutulan fotoğraf dosyalarının dizisi.
 * @param {Function} setPhotos - Üst bileşendeki fotoğraf dizisini güncelleyen state fonksiyonu.
 * @param {number} [limit=5] - Yüklenebilecek maksimum fotoğraf sayısı. Varsayılan olarak 5'tir.
 */
function PhotoUploader({ photos, setPhotos, limit = 5 }) {

    // Yeni bir fotoğraf seçildiğinde veya çekildiğinde çalışır
    const handleFileChange = (event) => {
        // Eğer bir dosya seçildiyse ve limit dolmadıysa
        if (event.target.files && event.target.files[0] && photos.length < limit) {
            const newPhoto = event.target.files[0];
            // Üst bileşendeki state'i, gelen yeni fotoğrafı ekleyerek güncelle
            setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        }
    };

    // Bir fotoğrafı önizleme listesinden kaldırmak için çalışır
    const handleRemovePhoto = (indexToRemove) => {
        // Üst bileşendeki state'i, gelen index'i filtreleyerek güncelle
        setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="mb-3">
            <label className="form-label">
                Fotoğraflar ({photos.length}/{limit}) <span className="text-danger">*</span>
            </label>

            {/* Fotoğraf Önizlemeleri */}
            {photos.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-2 p-2 border rounded bg-light">
                    {photos.map((photo, index) => (
                        <div key={index} className="position-relative">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt={`Önizleme ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
                                style={{ width: '24px', height: '24px', transform: 'translate(40%, -40%)' }}
                                onClick={() => handleRemovePhoto(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Yeni Fotoğraf Ekleme Butonu/Alanı */}
            {photos.length < limit && (
                <div>
                    <label htmlFor="photo-uploader-input" className="btn btn-outline-secondary">
                        <i className="bi bi-camera-fill me-2"></i>
                        Fotoğraf Çek
                    </label>
                    <input
                        type="file"
                        id="photo-uploader-input"
                        className="d-none" // Input'u her zaman gizli tutuyoruz
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        // Input'un value'sunu sıfırlayarak aynı dosyanın tekrar seçilmesini sağlıyoruz
                        onClick={(event) => { event.target.value = null }}
                    />
                </div>
            )}
        </div>
    );
}

export default PhotoUploader;