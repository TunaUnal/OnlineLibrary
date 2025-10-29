import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFileStatus, getAllFiles, getFilesByFilter } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import DataTable from './DataTable';
import EditFileModal from '../EditFileModal';
import { setText } from '../../Utils/SwalAlert';
import DownloadButton from '../../Utils/DownloadButton';
import { clearFilteredFiles } from '../../store/FileSlice';
import { useMemo } from 'react';
function PendingFiles() {
  const [editing, setEditing] = useState(null);
  const filter = { status: 'pending' };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFilesByFilter({ filter }));

    return () => {
      dispatch(clearFilteredFiles());
    };
  }, [dispatch]);

  const pendingFiles = useSelector((store) => store.files.filteredFiles) || null;

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
        console.log(id);
        console.log(text.setStatus);
        await dispatch(changeFileStatus({ id: id, status: text.setStatus })).unwrap();

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

  const setData = useMemo(
    () => ({
      data: pendingFiles,
      title: 'Onay Bekleyen Dosyalar',
      actions: (row) => {
        return (
          <>
            <DownloadButton fileId={row.original.id} filename={row.original.filename} />

            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => handleChange(row.original.id, 'confirm')}
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
    }),
    [pendingFiles]
  );
  if (!pendingFiles || pendingFiles.length === 0) {
    return <div>Yükleniyor...</div>;
  }
  return (
    <>
      {setData.data.length != 0 && <DataTable data={setData}></DataTable>}
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

export default PendingFiles;
