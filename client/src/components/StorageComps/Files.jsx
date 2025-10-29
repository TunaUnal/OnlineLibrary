import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFiles } from '../../store/FileSlice';
import GetFileIcon from '../GeneralComponents/GetFileIcon';
import { downloadFile } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import { clearError } from '../../store/FileSlice';
export default function StorageComponent({ id }) {
  const dispatch = useDispatch();
  const { files, loading, error, errors } = useSelector((state) => state.files);
  const downloadError = errors.downloadError;

  useEffect(() => {
    dispatch(getFiles({ id }));

    return () => {
      dispatch(clearError('downloadError')); // Bileşen unmount olduğunda hata mesajını temizle
    };
  }, [dispatch]);

  const handleDownload = async (fileId) => {
    // Sadece dosya id'sini vererek thunk'ı dispatch ediyoruz.
    dispatch(downloadFile(fileId));
  };

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Hata: {error}</div>;
  }

  if (downloadError) {
    Swal.fire({ icon: 'error', title: 'Hata', text: downloadError });
  }

  return (
    <>
      <div>
        {files.length === 0 ? (
          <div className="alert alert-info mt-3">Gösterilecek dosya bulunmamaktadır.</div>
        ) : (
          <div className="">
            {files.map((file) => (
              <div
                className="alert alert-primary alert-sm  d-flex justify-content-between"
                style={{ cursor: 'default' }}
                key={file.id}
              >
                <span className="d-flex align-items-center gap-2">
                  <GetFileIcon filename={file} />
                  <span>{file.filename}</span>
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => handleDownload(file.id)}>
                  <i className="bi bi-cloud-download"></i>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
