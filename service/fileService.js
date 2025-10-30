import FileModel from "../models/FileModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";
import { Op } from "sequelize";
import fs from "fs";
import mime from "mime-types"; // Kütüphaneyi import et
import path from "path";
import {
  flattenSequelizeRelations,
  excludeKeys,
  pickKeys,
} from "../utils/object.js";
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

const getFilesByFilter = async (queryParams = {}, options = {}) => {
  const {
    filter = {},
    page = 1,
    limit = 20,
    sort = "id",
    order = "DESC",
  } = queryParams;

  const {
    includeUser = false,
    includeCategory = false,
    removeKeys = [],
  } = options;

  // Gelen sayfa ve limit değerlerinin sayı olduğundan emin oluyoruz.
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  // Sayfalama için 'offset' değerini hesaplıyoruz.
  // Örn: 2. sayfadaysan ve limit 20 ise, ilk 20 kaydı atlaman gerekir. offset = (2-1)*20 = 20.
  const offset = (parsedPage - 1) * parsedLimit;

  const sequelizeQuery = {
    where: filter, // URL'den gelen filtre objesi: { status: 'approved', user_id: '5' }
    limit: parsedLimit, // Sayfa başına kaç kayıt getirileceği
    offset: offset, // Kaç kayıt atlanacağı
    order: [
      [sort, order], // Sıralama. örn: [['createdAt', 'DESC']]
    ],
  };

  if (includeUser) {
    sequelizeQuery.include = [
      {
        model: UserModel,
        as: "user", // Model tanımınızdaki ilişki adıyla eşleşmeli
        attributes: ["name"], // Sadece istediğimiz alanları alalım
      },
    ];
  }
  if (includeCategory) {
    sequelizeQuery.include += [
      {
        model: CategoryModel,
        as: "category", // Model tanımınızdaki ilişki adıyla eşleşmeli
        attributes: ["name"], // Sadece istediğimiz alanları alalım
      },
    ];
  }

  const { count, rows } = await FileModel.findAndCountAll(sequelizeQuery);

  const flattenedData = excludeKeys(
    flattenSequelizeRelations(rows),
    removeKeys
  );

  // 3. ADIM: Yanıt için Veriyi ve Sayfalama Bilgilerini Hazırlama

  // Toplam sayfa sayısını hesaplıyoruz.
  const totalPages = Math.ceil(count / parsedLimit);

  return {
    data: flattenedData, // O sayfadaki veriler
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

const downloadFile = async (id) => {
  const file = await FileModel.findByPk(id);
  if (file) {
    const filePath = file.path; // Dosyanın sunucudaki tam yolu

    // Dosya uzantısından MIME türünü bul
    const mimeType = mime.lookup(file.ext) || "application/octet-stream";

    const fileStream = fs.createReadStream(filePath);

    return {
      stream: fileStream,
      filename: `${file.filename}.${file.ext}`,
      mimeType: mimeType, // MIME türünü de controller'a gönder
    };
  }
  return null;
};

const uploadFile = async (user, file, body) => {
  console.log(file);
  const ext = path.extname(file.originalname).replace(".", ""); // ör: "pdf"
  const userId = user.id;
  const filename = body.filename;
  const category_id = body.category_id;
  const newFile = await FileModel.create({
    filename: filename,
    stored_name: file.filename,
    ext: ext,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    user_id: userId,
    uploaded_at: Date.now(),
    category_id: category_id,
  });

  return newFile;
};

export default {
  uploadFile,
  getFileById,
  getFilesByFilter,
  updateFile,
  changeFileStatus,
  downloadFile,
  uploadFile,
};
