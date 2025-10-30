import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFileStatus, getPendingFiles } from '../../store/FileSlice';
import Swal from 'sweetalert2';
import DataTable from './DataTable';
import EditFileModal from '../EditFileModal';
import { setText } from '../../Utils/SwalAlert';
function PendingFiles() {
  const [editing, setEditing] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPendingFiles());
  }, [dispatch]);

  const pendingFiles = useSelector((store) => store.files.pendingFiles) || null;

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

  if (!pendingFiles) {
    console.log(pendingFiles);
    return <div>Yükleniyor...</div>;
  }
  if (pendingFiles.length === 0) {
    return (
      <div className="alert alert-sm alert-danger text-center mt-4">Onay bekleyen dosya yok.</div>
    );
  }
  return (
    <>
      {pendingFiles.length !== 0 && (
        <>
          <h5 className="text-center mt-4">Onay Bekleyen Dosyalar</h5>
          <DataTable pendingFiles={pendingFiles} handleChange={handleChange}></DataTable>
        </>
      )}
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
