/**
 * Bir objeden veya bir dizi objeden belirtilen anahtarları kaldırır (mutate etmez).
 * @param {object|Array<object>} data - İşlem yapılacak obje veya obje dizisi.
 *- @param {Array<string>} keysToRemove - Kaldırılacak anahtarların listesi.
 * @returns {object|Array<object>} - Temizlenmiş yeni obje veya obje dizisi.
 */
export const excludeKeys = (data, keysToRemove = []) => {
  // Eğer veri bir dizi ise, her bir eleman için fonksiyonu tekrar çağır.
  if (Array.isArray(data)) {
    return data.map((item) => excludeKeys(item, keysToRemove));
  }

  // Veri bir obje ise devam et.
  if (typeof data !== "object" || data === null) {
    return data; // Obje değilse, olduğu gibi döndür.
  }

  // Orijinal objeyi değiştirmemek için bir kopya oluştur.
  const newObject = { ...data };

  // Kaldırılacak her bir anahtar için...
  keysToRemove.forEach((key) => {
    // Eğer objede o anahtar varsa, sil.
    if (key in newObject) {
      delete newObject[key];
    }
  });

  return newObject;
};

/**
 * Bir objeden veya bir dizi objeden sadece belirtilen anahtarları alır (whitelist).
 * @param {object|Array<object>} data - İşlem yapılacak obje veya obje dizisi.
 * @param {Array<string>} keysToPick - Alınacak anahtarların listesi.
 * @returns {object|Array<object>} - Sadece istenen anahtarları içeren yeni obje veya obje dizisi.
 */
export const pickKeys = (data, keysToPick = []) => {
  // Eğer veri bir dizi ise, her bir eleman için fonksiyonu tekrar çağır.
  if (Array.isArray(data)) {
    return data.map((item) => pickKeys(item, keysToPick));
  }

  if (typeof data !== "object" || data === null) {
    return data;
  }

  const newObject = {};

  // Alınacak her bir anahtar için...
  keysToPick.forEach((key) => {
    // Eğer orijinal objede o anahtar varsa, yeni objeye ekle.
    if (key in data) {
      newObject[key] = data[key];
    }
  });

  return newObject;
};

/**
 * Sequelize'den gelen ve ilişkili modelleri içeren bir dizi objeyi düzleştirir.
 * İç içe objelerdeki alanları ana objeye taşır.
 *
 * @param {Array<object>} rows - Sequelize'nin findAndCountAll'dan döndürdüğü 'rows' dizisi.
 * @returns {Array<object>} - Düzleştirilmiş objeleri içeren yeni bir dizi.
 *
 * @example
 * // Girdi: { id: 1, name: 'dosya.txt', user: { id: 5, name: 'Arif' } }
 * // Çıktı: { id: 1, name: 'dosya.txt', userId: 5, userName: 'Arif' }
 */
export const flattenSequelizeRelations = (rows) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => {
    // Sequelize model instance'ını düz bir JavaScript objesine çevir.
    const plainObject = row.get({ plain: true });

    // Düzleştirilecek objeyi klonlayarak başlayalım.
    const flattened = { ...plainObject };

    // Objenin kendi anahtarları üzerinde dönelim.
    for (const key in plainObject) {
      // Değer bir obje mi, null değil mi ve bir Sequelize ilişkisi mi?
      // (Sequelize ilişkileri genellikle model instance'larıdır, basit objelerden ayırt edebiliriz)
      if (
        typeof plainObject[key] === "object" &&
        plainObject[key] !== null &&
        !Array.isArray(plainObject[key]) // 'hasMany' ilişkilerini şimdilik dışarıda bırakalım
      ) {
        const nestedObject = plainObject[key];

        // İç içe objenin anahtarları üzerinde dönelim.
        for (const nestedKey in nestedObject) {
          // Çakışmayı önlemek için yeni bir anahtar adı oluştur:
          // 'user' objesindeki 'id' -> 'userId'
          // 'user' objesindeki 'name' -> 'userName'
          const newKey = `${key}_${nestedKey}`;

          // Ana objede bu yeni isimde bir anahtar ZATEN VARSA, işlem yapma.
          // Bu, ana objenin kendi 'id'sinin üzerine yazılmasını önler.
          // örn: 'id' anahtarı varken, 'userId' eklenir ama 'id' üzerine yazılmaz.
          if (!flattened.hasOwnProperty(nestedKey) || nestedKey !== "id") {
            flattened[newKey] = nestedObject[nestedKey];
          }
        }

        // Orijinal iç içe objeyi ana objeden sil.
        delete flattened[key];
      }
    }

    return flattened;
  });
};
