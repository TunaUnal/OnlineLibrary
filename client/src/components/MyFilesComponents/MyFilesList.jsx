import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyFiles } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import EditFileModal from '../EditFileModal';
import DataTable from './DataTable';
import { useMemo } from 'react';
import { downloadFile } from '../../store/FileSlice';
import DownloadButton from '../../Utils/DownloadButton';
export default function MyFilesList() {
  const dispatch = useDispatch();

  const { myFiles, loadingMyFiles, error } = useSelector((state) => state.files);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(getMyFiles());
  }, [dispatch]);

  if (loadingMyFiles) {
    return <p className="text-center">Yükleniyor...</p>;
  }

  const handleChange = async (id, type) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-sm btn-success',
        cancelButton: 'btn btn-sm btn-secondary mx-2',
      },
      buttonsStyling: false,
    });
    const setText = (type) => {
      switch (type) {
        case 'delete':
          return {
            text: 'Dosya silinecek. Bu dosyayı yöneticiler dahil kimse birdaha göremeyecek.',
            confirmBtnText: 'Evet, SİL',
            successTitle: 'Silindi',
            successText: 'Dosya başarıyla silindi.',
            setStatus: 'deleted',
          };
        case 'hide':
          return {
            text: 'Dosya gizlenecek. Bu dosyayı sadece sen ve moderatörler görebilir. İstediğin zaman yeniden yayınlayabilirsin.',
            confirmBtnText: 'Evet, GİZLE',
            successTitle: 'Gizlendi',
            successText: 'Dosya başarıyla gizlendi.',
            setStatus: 'hide',
          };
        case 'reApprove':
          return {
            text: 'Dosya yeniden yayınlanacak.',
            confirmBtnText: 'Evet, Yeniden Yayınla',
            successTitle: 'Yayınlandı',
            successText: 'Dosya başarıyla yeniden yayınlandı.',
            setStatus: 'approved',
          };
        case 'sendToConfirm':
          return {
            text: 'Dosya yeniden onaya gönderilecek. Onaylıyor musun?',
            confirmBtnText: 'Evet, GÖNDER',
            successTitle: 'Gönderildi',
            successText: 'Dosya başarıyla yeniden onaya gönderildi.',
            setStatus: 'pending',
          };
        default:
          break;
      }
    };

    const text = setText(type);

    const result = await swalWithBootstrapButtons.fire({
      title: 'Emin misin?',
      text: text.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: text.confirmBtnText,
      cancelButtonText: 'Hayır, İptal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await updateFile(id, text.setStatus);

        await swalWithBootstrapButtons.fire({
          title: text.successTitle,
          text: text.successText,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        dispatch(getMyFiles());
      } catch (err) {
        await swalWithBootstrapButtons.fire({
          title: 'Hata',
          text: err.message || 'Sunucu hatası oluştu.',
          icon: 'error',
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await swalWithBootstrapButtons.fire({
        title: 'İptal edildi',
        text: 'Dosya durumu değişmedi.',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const setData = () => {
    return {
      data: myFiles,
      actions: (row) => {
        return (
          <>
            <DownloadButton fileId={row.original.id} variant="icon" />

            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => setEditing(row.original)}
              >
                Düzenle
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleChange(row.original.id, 'hide')}
              >
                Sil
              </button>
            </div>
          </>
        );
      },
    };
  };

  return (
    <>
      <h5 className="text-center">Dosyalarım</h5>
      <div className="row justify-content-center">
        {myFiles.length > 0 ? (
          <DataTable data={setData()}></DataTable>
        ) : (
          <p className="text-muted text-center">Henüz dosya yüklemedin.</p>
        )}
      </div>

      <EditFileModal
        show={!!editing}
        onHide={() => setEditing(null)}
        file={editing}
        onSaved={() => dispatch(getMyFiles())}
        enforceFocus={false}
        restoreFocus={false}
      />
    </>
  );
}
