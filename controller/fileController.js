import fileService from "../service/fileService.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;
    const body = req.body;
    const result = await fileService.uploadFile(user, file, body);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFileById = async (req, res) => {
  console.log("gerFileById");
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
    const files = await fileService.getFilesByFilter({ user_id: userId });
    res.status(200).json({ ...files });
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

export const getPendingFiles = async (req, res) => {
  try {
    const files = await fileService.getFilesByFilter({
      filter: { status: "pending" },
    });
    res.status(200).json({ ...files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const fileData = await fileService.downloadFile(id);

    if (!fileData) {
      return res.status(404).json({ message: "Dosya bulunamadı." });
    }

    const { stream: fileStream, filename: clientFilename, mimeType } = fileData;

    // 1. Dosya adını URL formatına güvenle kodla
    const encodedFilename = encodeURIComponent(clientFilename);
    console.log("Encoded Filename:", encodedFilename);
    console.log(mimeType);
    // 2. SADECE modern ve çalışan Content-Disposition başlığını ayarla
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedFilename}`
    );

    // 3. Servisten gelen doğru MIME türünü ayarla
    res.setHeader("Content-Type", mimeType);

    // 4. Stream'i yanıt olarak gönder
    fileStream.pipe(res);
  } catch (error) {
    console.error("Dosya indirme hatası:", error);
    // Hata durumunda yanıt zaten gönderilmediyse hata mesajı yolla
    if (!res.headersSent) {
      res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
  }
};
