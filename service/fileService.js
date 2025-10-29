import FileModel from "../models/FileModel.js";
import { Op } from "sequelize";

const uploadFile = async (fileData) => {
  //const file = await FileModel.create(fileData);
  //return file;
};

const getFileById = async (id) => {
  const file = await FileModel.findByPk(id);
  return file;
};

// Sequelize'nin Operatörlerini (Op) import etmeyi unutma, bu gelişmiş filtreleme için gereklidir.

/**
 * Dosyaları dinamik filtreleme, sayfalama ve sıralama ile getirir.
 * @param {object} queryParams - Express'in req.query objesinden gelen parametreler.
 * @returns {object} - { data, pagination } formatında sonuçları döndürür.
 */
const getFilesByFilter = async (queryParams = {}) => {
  // 1. ADIM: Parametreleri Ayrıştırma ve Varsayılan Değerler Atama

  // queryParams'tan gelen değerleri ayrıştırıyoruz.
  // Eğer bir değer gelmezse, varsayılan değerleri (örn: page=1, limit=20) kullanıyoruz.
  const {
    filter = {},
    page = 1,
    limit = 20,
    sort = "id",
    order = "DESC",
  } = queryParams;

  // Gelen sayfa ve limit değerlerinin sayı olduğundan emin oluyoruz.
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  // Sayfalama için 'offset' değerini hesaplıyoruz.
  // Örn: 2. sayfadaysan ve limit 20 ise, ilk 20 kaydı atlaman gerekir. offset = (2-1)*20 = 20.
  const offset = (parsedPage - 1) * parsedLimit;

  // 2. ADIM: Sequelize ile Veritabanı Sorgusu

  // Bu Sequelize'nin en güçlü fonksiyonlarından biridir.
  // Hem filtreye uyan kayıtları (rows) hem de o filtreye uyan TOPLAM kayıt sayısını (count)
  // tek bir veritabanı sorgusuyla verimli bir şekilde getirir.
  const { count, rows } = await FileModel.findAndCountAll({
    where: filter, // URL'den gelen filtre objesi: { status: 'approved', user_id: '5' }
    limit: parsedLimit, // Sayfa başına kaç kayıt getirileceği
    offset: offset, // Kaç kayıt atlanacağı
    order: [
      [sort, order], // Sıralama. örn: [['createdAt', 'DESC']]
    ],
  });

  // 3. ADIM: Yanıt için Veriyi ve Sayfalama Bilgilerini Hazırlama

  // Toplam sayfa sayısını hesaplıyoruz.
  const totalPages = Math.ceil(count / parsedLimit);

  return {
    data: rows, // O sayfadaki veriler
    pagination: {
      totalItems: count, // Filtreye uyan toplam öğe sayısı
      totalPages: totalPages, // Toplam sayfa sayısı
      currentPage: parsedPage, // Mevcut sayfa
      limit: parsedLimit, // Sayfa başına limit
    },
  };
};

const updateFile = async (id, updateData) => {
  const file = await FileModel.findByPk(id);
  if (file) {
    await file.update(updateData);
    return file;
  }
  return null;
};

const changeFileStatus = async (id, status) => {
  const file = await FileModel.findByPk(id);
  if (file) {
    await file.update({ status });
    return file;
  }
  return null;
};

export default {
  uploadFile,
  getFileById,
  getFilesByFilter,
  updateFile,
  changeFileStatus,
};
