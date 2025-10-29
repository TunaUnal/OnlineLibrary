import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import DataTable from './DataTable';
import EditFileModal from '../EditFileModal';
function FileManager() {
  const [page, setPage] = useState('all');
  const [editing, setEditing] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllFiles());
  }, [dispatch]);

  const allFiles = useSelector((store) => store.files.allFiles).filter(
    (file) => file.status != 'deleted'
  );
  const pendingFiles = allFiles.filter((file) => file.status == 'pending');
  const rejectedFiles = allFiles.filter((file) => file.status == 'rejected');
  const approvedFiles = allFiles.filter((file) => file.status == 'approved');

  const updateFile = async (id, status) => {
    const res = await axios.post(
      'http://localhost/server2/api/index.php',
      { type: 'updateFileStatus', fileID: id, status: status },
      {
        withCredentials: true,
      }
    );
    if (!res.data.success) {
      throw new Error(res.data.message || 'Güncelleme başarısız');
    }
  };

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
        break;
      case 'reApprove':
        return {
          text: 'Dosya yeniden yayınlanacak.',
          confirmBtnText: 'Evet, Yeniden Yayınla',
          successTitle: 'Yayınlandı',
          successText: 'Dosya başarıyla yeniden yayınlandı.',
          setStatus: 'approved',
        };
        break;
      case 'sendToConfirm':
        return {
          text: 'Dosya yeniden onaya gönderilecek. Onaylıyor musun?',
          confirmBtnText: 'Evet, GÖNDER',
          successTitle: 'Gönderildi',
          successText: 'Dosya başarıyla yeniden onaya gönderildi.',
          setStatus: 'pending',
        };
        break;
      case 'reject':
        return {
          text: 'Dosya reddedilecek. Eğer kullanıcı silmez ise bu dosyayı yeniden kabul edebilirsin.',
          confirmBtnText: 'Evet, REDDET',
          successTitle: 'Reddedildi',
          successText: 'Dosya başarıyla reddedildi.',
          setStatus: 'rejected',
        };
        break;
      case 'confirm':
        return {
          text: 'Dosya onaylanacak ve tüm kullanıcılar tarafından görünür olacak.Dosyayı tekrardan beklemeye alabileceksin.',
          confirmBtnText: 'Evet, ONAYLA',
          successTitle: 'Onaylandı',
          successText: 'Dosya başarıyla yayınlandı.',
          setStatus: 'approved',
        };
        break;
      default:
        break;
    }
  };

  const handleChange = async (id, type) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-sm btn-success',
        cancelButton: 'btn btn-sm btn-secondary mx-2',
      },
      buttonsStyling: false,
    });

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

        dispatch(getAllFiles());
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
    switch (page) {
      case 'all':
        return {
          data: allFiles,
          title: 'Tüm Dosyalar',
          actions: (row) => {
            return (
              <>
                <a
                  type="button"
                  href={row.original.full_url}
                  className="btn btn-sm btn-primary me-1"
                >
                  Görüntüle
                </a>
              </>
            );
          },
        };
      case 'rejected':
        return {
          data: rejectedFiles,
          title: 'Reddedilen Dosyalar',
          actions: (row) => {
            return (
              <>
                <a
                  type="button"
                  href={row.original.full_url}
                  className="btn btn-sm btn-primary me-1"
                >
                  Görüntüle
                </a>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => handleChange(row.original.id, 'reApprove')}
                  >
                    Yayınla
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditing(row.original)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleChange(row.original.id, 'delete')}
                  >
                    Sil
                  </button>
                </div>
              </>
            );
          },
        };
      case 'pending':
        return {
          data: pendingFiles,
          title: 'Onay Bekleyen Dosyalar',
          actions: (row) => {
            return (
              <>
                <a
                  type="button"
                  href={row.original.full_url}
                  className="btn btn-sm btn-primary me-1"
                >
                  Görüntüle
                </a>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => handleChange(row.original.id, 'confirm')}
                  >
                    Kabul
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditing(row.original)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleChange(row.original.id, 'reject')}
                  >
                    Reddet
                  </button>
                </div>
              </>
            );
          },
        };
      case 'approved':
        return {
          data: approvedFiles,
          title: 'Yayınlanan Dosyalar',
          actions: (row) => {
            return (
              <>
                <a
                  type="button"
                  href={row.original.full_url}
                  className="btn btn-sm btn-primary me-1"
                >
                  Görüntüle
                </a>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => handleChange(row.original.id, 'hide')}
                  >
                    Gizle
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditing(row.original)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleChange(row.original.id, 'delete')}
                  >
                    Sil
                  </button>
                </div>
              </>
            );
          },
        };
      case 'hide':
        return {
          data: hideFiles,
          title: 'Gizlenen Dosyalar',
          actions: (row) => {
            return (
              <>
                <a
                  type="button"
                  href={row.original.full_url}
                  className="btn btn-sm btn-primary me-1"
                >
                  Görüntüle
                </a>

                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => handleChange(row.original.id, 'reApprove')}
                  >
                    Yeniden Yayınla
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditing(row.original)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleChange(row.original.id, 'delete')}
                  >
                    Sil
                  </button>
                </div>
              </>
            );
          },
        };
    }
  };

  const isPage = (p) => (p == page ? 'active' : '');

  return (
    <>
      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button className={`nav-link ${isPage('all')}`} onClick={() => setPage('all')}>
            Tüm Dosyalar
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${isPage('pending')}`} onClick={() => setPage('pending')}>
            Onay Bekleyenler
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${isPage('rejected')}`} onClick={() => setPage('rejected')}>
            Reddedilenler
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${isPage('approved')}`} onClick={() => setPage('approved')}>
            Yayınlananlar
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${isPage('hide')}`} onClick={() => setPage('hide')}>
            Gizlenenler
          </button>
        </li>
      </ul>

      <DataTable data={setData(allFiles)}></DataTable>
      <EditFileModal
        show={!!editing}
        onHide={() => setEditing(null)}
        file={editing}
        onSaved={() => dispatch(getAllFiles())}
        enforceFocus={false}
        restoreFocus={false}
      />
    </>
  );
}

export default FileManager;
