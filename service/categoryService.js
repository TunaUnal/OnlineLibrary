import CategoryModel from "../models/categoryModel.js";

const getCategoryById = async (id) => {
  const category = await CategoryModel.findByPk(id);
  return category;
};

const getAllCategories = async () => {
  const categories = await CategoryModel.findAll();
  return categories;
};

export default {
  getCategoryById,
  getAllCategories,
};
