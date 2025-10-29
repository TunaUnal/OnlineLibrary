import fileService from "../service/fileService.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const result = await fileService.uploadFile(file);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await fileService.getFileById(id);
    if (file) {
      res.status(200).json({ data: file });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFileByFilter = async (req, res) => {
  const filters = req.params;
  console.log(req);
  console.log("--- ROTA İÇİNDE REQ.QUERY GELDİ ---");
  console.log(req.query);
  console.log("------------------------------------");
  try {
    const files = await fileService.getFilesByFilter(filters);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFiles = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const files = await fileService.getFileByFilter({ user_id: userId });
    res.status(200).json({ data: files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedFile = await fileService.updateFile(id, updateData);
    if (updatedFile) {
      res.status(200).json({ data: updatedFile });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const changeFileStatus = async (req, res) => {
  if (!req.body.status) {
    return res
      .status(400)
      .json({ message: "Bad Request: 'status' is required" });
  }

  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedFile = await fileService.changeFileStatus(id, status);
    if (updatedFile) {
      res.status(200).json({ data: updatedFile });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
