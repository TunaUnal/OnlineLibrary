// components/EditFileModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import CategoryOptions from './UploadComps/CategoryOptions';
import { useDispatch } from 'react-redux';
import { updateFile } from '../store/FileSlice';
export default function EditFileModal({ show, onHide, file, onSaved }) {
  const dispatch = useDispatch();
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categoryPath, setCategoryPath] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  // Uzantıyı al
  const extension = file?.filename?.split('.').pop() || '';

  // file prop değişince formu doldur
  useEffect(() => {
    if (!file) return;
    setFilename(file.custom_name || file.filename);
    setDescription(file.description || '');
    setCategoryId(file.category_id);
    setCategoryPath(file.category_path || '');
  }, [file]);

  const handleSave = async () => {
    if (!filename || !categoryId || !description) {
      Swal.fire('Eksik', 'Tüm alanları doldurun.', 'warning');
      return;
    }
    try {
      const payload = {
        id: file.id,
        filename: filename,
        description: description,
        category_id: categoryId,
      };

      // 2) Thunk’u dispatch edip tamamlanmasını bekle
      await dispatch(updateFile(payload)).unwrap();

      // 3) Başarılıysa alert, parent’ı bilgilendir, modal’ı kapat
      Swal.fire('Başarılı', 'Dosya güncellendi.', 'success');
      onSaved?.();
      onHide();
    } catch (errMessage) {
      // errMessage, thunkAPI.rejectWithValue’e verdiğiniz mesaj olur
      Swal.fire('Hata', 'Güncelleme yapılamadı.', 'error');
      console.log(errMessage);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} enforceFocus={false} restoreFocus={false}>
        <Modal.Header closeButton>
          <Modal.Title>Dosya Bilgilerini Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Dosya Adı</label>
            <input
              type="text"
              className="form-control"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kategori</label>
            <input
              type="text"
              className="form-control"
              value={categoryPath || 'Kategori seç'}
              readOnly
              onClick={() => setShowCatModal(true)}
              style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Kategori Seçim Modal’ı */}
      <CategoryOptions
        showModal={showCatModal}
        setShowModal={setShowCatModal}
        selectedCategoryId={categoryId}
        selectedCategoryPath={categoryPath}
        setSelectedCategoryId={setCategoryId}
        setSelectedCategoryPath={setCategoryPath}
      />
    </>
  );
}
