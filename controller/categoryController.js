import categoryService from "../service/categoryService.js";

export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    if (category) {
      res.status(200).json({ data: category });
    } else {
      res.status(404).json({ message: "Kategori bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
