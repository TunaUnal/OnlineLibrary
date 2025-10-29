import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryOptions from './CategoryOptions';
import { uploadFile } from '../../store/FileSlice';
import { useDispatch } from 'react-redux';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState('');
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const validateFile = (file) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
    ];
    return allowed.includes(file.type);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) {
      const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
      setFile(f);
      setFilename(nameWithoutExt);
    } else {
      Swal.fire('Hata', 'Geçersiz dosya türü.', 'error');
    }
  };

  const cancelSelection = () => {
    setFile(null);
    setFilename('');
    setFileDescription('');
    setSelectedCategoryId(null);
    setSelectedCategoryPath('');
  };

  const handleUpload = async () => {
    if (!file || !filename || !selectedCategoryId) {
      Swal.fire('Eksik', 'Tüm alanları doldurun.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('description', fileDescription);
    formData.append('category_id', selectedCategoryId);
    formData.append('type', 'uploadFile');

    await dispatch(uploadFile(formData))
      .unwrap()
      .then(() => {
        Swal.fire('Başarılı', 'Dosya başarıyla yüklendi.', 'success');
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          cancelSelection();
        }, 1500);
      })
      .catch((err) => {
        Swal.fire('Hata', err.message || 'Dosya yüklenemedi.', 'error');
        setProgress(0);
      });
  };
  return (
    <div className="container mt-4">
      {!file && (
        <>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept=".pdf,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          <p>Lütfen bir dosya seç, gerekli düzenlemeler dosya seçildikten sonra gözükecektir.</p>
        </>
      )}

      {file && (
        <>
          <div className="mt-3">
            <div className="alert alert-success d-flex justify-content-between">
              <span>
                Dosya seçildi : <strong> {file.name} </strong>
              </span>
              <span onClick={cancelSelection} style={{ textDecoration: 'underline' }}>
                Seçimi iptal et
              </span>
            </div>
          </div>
          <div className="mt-3">
            <label>Dosya Adı:</label>
            <input
              className="form-control"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <p className="mx-1">Örnek : Elektrik Makinaları 1.Vize Çıkmış Sorular - 2023-24</p>
          </div>
          <div className="mt-3"></div>

          <div className="mt-3">
            <label>Dosya Açıklama:</label>
            <input
              className="form-control"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
            />
            <p className="mx-1">Bu dosyayı açıklayın [Opsiyonel]</p>
          </div>

          <div className="mt-3">
            <label>Kategori:</label>
            <input
              className="form-control"
              readOnly
              value={selectedCategoryPath || 'Kategori seç'}
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
            />
          </div>

          <div className="mt-3">
            <label>Yükleme Durumu:</label>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          </div>

          <button className="btn btn-success w-100 mt-3" onClick={handleUpload}>
            Yükle
          </button>

          <CategoryOptions
            showModal={showModal}
            setShowModal={setShowModal}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            selectedCategoryPath={selectedCategoryPath}
            setSelectedCategoryPath={setSelectedCategoryPath}
          ></CategoryOptions>
        </>
      )}
    </div>
  );
}
