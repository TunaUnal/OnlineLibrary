import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SingleFile from './SingleFile'
import Swal from 'sweetalert2';
import { getAllFiles, getFiles } from '../../store/FileSlice';
import axios from 'axios';
import DataTable from './DataTable';

function PendingFiles() {
    const [page, setPage] = useState('pending') // all | rejected | approved | pending | hide 

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllFiles())
    }, [dispatch])
    const allFiles = useSelector(store => store.files.allFiles).filter(file => file.status != "deleted")

    const pendingFiles = allFiles.filter(file => file.status == 'pending')
    console.log(pendingFiles)

    const rejectedFiles = allFiles.filter(file => file.status == 'rejected')
    console.log(rejectedFiles)

    const approvedFiles = allFiles.filter(file => file.status == 'approved')
    console.log(approvedFiles)

    const hideFiles = allFiles.filter(file => file.status == 'hide')
    console.log(hideFiles)



    const updateFile = async (id, status) => {
        const res = await axios.post('http://localhost/server/api/index.php', { type: 'updateFileStatus', fileID: id, status: status }, {
            withCredentials: true
        });
        if (!res.data.success) {
            throw new Error(res.data.message || 'Güncelleme başarısız');
        }
    }

    const handleReject = async (id) => {
        console.log(id)
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-sm btn-danger",
                cancelButton: "btn btn-sm btn-primary mx-2"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Emin misin?",
            text: "Dosya reddedilecek. Eğer kullanıcı silmez ise bu dosyayı yeniden kabul edebilirsin.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, REDDET",
            cancelButtonText: "Hayır, İptal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateFile(id, "rejected");

                await swalWithBootstrapButtons.fire({
                    title: "Reddedildi!",
                    text: "Dosya başarıyla reddedildi.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                dispatch(getAllFiles());

            } catch (err) {

                await swalWithBootstrapButtons.fire({
                    title: "Hata",
                    text: err.message || "Sunucu hatası oluştu.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "İptal edildi",
                text: "Dosya hala beklemede.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleConfirm = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-sm btn-success",
                cancelButton: "btn btn-sm btn-secondary mx-2"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Emin misin?",
            text: "Dosya onaylanacak ve tüm kullanıcılar tarafından görünür olacak. Dosyayı tekrardan beklemeye alabileceksin.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, ONAYLA",
            cancelButtonText: "Hayır, İptal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateFile(id, "approved");

                await swalWithBootstrapButtons.fire({
                    title: "Onaylandı!",
                    text: "Dosya başarıyla onaylandı.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                dispatch(getAllFiles());

            } catch (err) {

                await swalWithBootstrapButtons.fire({
                    title: "Hata",
                    text: err.message || "Sunucu hatası oluştu.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "İptal edildi",
                text: "Dosya hala beklemede.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-sm btn-success",
                cancelButton: "btn btn-sm btn-secondary mx-2"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Emin misin?",
            text: "Dosya silinecek. Bu dosyayı sahibi ve sen dahil kimse tekrardan göremeyecek.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, SİL",
            cancelButtonText: "Hayır, İptal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateFile(id, "deleted");

                await swalWithBootstrapButtons.fire({
                    title: "Silindi!",
                    text: "Dosya başarıyla silindi.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                dispatch(getAllFiles());

            } catch (err) {

                await swalWithBootstrapButtons.fire({
                    title: "Hata",
                    text: err.message || "Sunucu hatası oluştu.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "İptal edildi",
                text: "Dosya durumu değişmedi.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleHide = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-sm btn-success",
                cancelButton: "btn btn-sm btn-secondary mx-2"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Emin misin?",
            text: "Dosya gizlenecek. Bu dosyayı sadece sahibi ve moderatörler görebilir. İstediğin zaman yeniden yayınlayabilirsin.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, GİZLE",
            cancelButtonText: "Hayır, İptal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateFile(id, "hide");

                await swalWithBootstrapButtons.fire({
                    title: "Gizlendi!",
                    text: "Dosya başarıyla gizlendi.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                dispatch(getAllFiles());

            } catch (err) {

                await swalWithBootstrapButtons.fire({
                    title: "Hata",
                    text: err.message || "Sunucu hatası oluştu.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "İptal edildi",
                text: "Dosya durumu değişmedi.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleReApprove = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-sm btn-success",
                cancelButton: "btn btn-sm btn-secondary mx-2"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Emin misin?",
            text: "Dosya yeniden yayınlanacak. İstediğin zaman yeniden değiştirebilirsin.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, YAYINLA",
            cancelButtonText: "Hayır, İptal",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateFile(id, "approved");

                await swalWithBootstrapButtons.fire({
                    title: "Yayınlandı!",
                    text: "Dosya başarıyla yeniden yayınlandı.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                dispatch(getAllFiles());

            } catch (err) {

                await swalWithBootstrapButtons.fire({
                    title: "Hata",
                    text: err.message || "Sunucu hatası oluştu.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await swalWithBootstrapButtons.fire({
                title: "İptal edildi",
                text: "Dosya durumu değişmedi.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    };


    const isPage = (p) => p == page ? "active" : ""

    return (
        <>
            <ul className="nav nav-tabs justify-content-center mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${isPage('all')}`} onClick={() => setPage("all")}>Tüm Dosyalar</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${isPage('pending')}`} onClick={() => setPage("pending")}>Onay Bekleyenler</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${isPage('rejected')}`} onClick={() => setPage("rejected")}>Reddedilenler</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${isPage('approved')}`} onClick={() => setPage("approved")}>Yayınlananlar</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${isPage('hide')}`} onClick={() => setPage("hide")}>Gizlenenler</button>
                </li>
            </ul>

            {page == 'all' && (
                <>
                    <h5 className="text-center">Tüm Dosyalar</h5>
                    <div className="row justify-content-center">
                        {allFiles.length > 0 ?
                            (
                                <>

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Dosya Adı</th>
                                                <th scope="col">Dizin</th>
                                                <th scope="col">Yükleyen</th>
                                                <th scope="col">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allFiles.map((file, i) => (
                                                <React.Fragment key={i}>
                                                    <tr className=''>
                                                        <th scope="row">1</th>
                                                        <td>{file.custom_name || file.filename}</td>
                                                        <td>{file.category_path}</td>
                                                        <td>{file.username}</td>
                                                        <td>
                                                            <a type="button" href={file.full_url} className="btn btn-sm btn-primary me-1">Görüntüle</a>

                                                            {/*<div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleReject(file.id)} >Reddet</button>
                                                            <button type="button" className="btn btn-sm btn-warning">Düzenle</button>
                                                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleConfirm(file.id)}>Kabul</button>
                                                        </div> */}
                                                        </td>
                                                    </tr>
                                                    {file.description && (

                                                        <tr>
                                                            <td colSpan={5} >
                                                                <strong>Açıklama : </strong>{file.description}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                    <DataTable files={allFiles} ></DataTable>
                                
                                
                                </>
                            )
                            :
                            (
                                <p className="text-muted text-center">Dosya yok</p>
                            )
                        }
                    </div>
                </>

            )}
            {page == 'pending' && (
                <>
                    <h5 className="text-center">Onay Bekleyen Dosyalar</h5>
                    <div className="row justify-content-center">
                        {pendingFiles.length > 0 ?
                            (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Dosya Adı</th>
                                            <th scope="col">Dizin</th>
                                            <th scope="col">Yükleyen</th>
                                            <th scope="col">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingFiles.map((file, i) => (
                                            <React.Fragment key={i}>
                                                <tr className=''>
                                                    <th scope="row">1</th>
                                                    <td>{file.custom_name || file.filename}</td>
                                                    <td>{file.category_path}</td>
                                                    <td>{file.username}</td>
                                                    <td>
                                                        <a type="button" href={file.full_url} className="btn btn-sm btn-primary me-1">Görüntüle</a>

                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleReject(file.id)} >Reddet</button>
                                                            <button type="button" className="btn btn-sm btn-warning">Düzenle</button>
                                                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleConfirm(file.id)}>Kabul</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {file.description && (

                                                    <tr>
                                                        <td colSpan={5} >
                                                            <strong>Açıklama : </strong>{file.description}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            :
                            (
                                <p className="text-muted text-center">Onay bekleyen dosya yok</p>
                            )
                        }
                    </div>
                </>

            )}
            {page == 'rejected' && (
                <>
                    <h5 className="text-center">Reddedilen Dosyalar</h5>
                    <div className="row justify-content-center">
                        {rejectedFiles.length > 0 ?
                            (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Dosya Adı</th>
                                            <th scope="col">Dizin</th>
                                            <th scope="col">Yükleyen</th>
                                            <th scope="col">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rejectedFiles.map((file, i) => (
                                            <React.Fragment key={i}>
                                                <tr className=''>
                                                    <th scope="row">1</th>
                                                    <td>{file.custom_name || file.filename}</td>
                                                    <td>{file.category_path}</td>
                                                    <td>{file.username}</td>
                                                    <td>
                                                        <a type="button" href={file.full_url} className="btn btn-sm btn-primary me-1">Görüntüle</a>

                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(file.id)} >Sil</button>
                                                            <button type="button" className="btn btn-sm btn-warning">Düzenle</button>
                                                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleConfirm(file.id)}>Yayınla</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {file.description && (

                                                    <tr>
                                                        <td colSpan={5} >
                                                            <strong>Açıklama : </strong>{file.description}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            :
                            (
                                <p className="text-muted text-center">Reddedilen dosya yok</p>
                            )
                        }
                    </div>
                </>

            )}
            {page == 'approved' && (
                <>
                    <h5 className="text-center">Yayınlanan Dosyalar</h5>
                    <div className="row justify-content-center">
                        {approvedFiles.length > 0 ?
                            (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Dosya Adı</th>
                                            <th scope="col">Dizin</th>
                                            <th scope="col">Yükleyen</th>
                                            <th scope="col">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {approvedFiles.map((file, i) => (
                                            <React.Fragment key={i}>
                                                <tr className=''>
                                                    <th scope="row">1</th>
                                                    <td>{file.custom_name || file.filename}</td>
                                                    <td>{file.category_path}</td>
                                                    <td>{file.username}</td>
                                                    <td>
                                                        <a type="button" href={file.full_url} className="btn btn-sm btn-primary me-1">Görüntüle</a>

                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleHide(file.id)} >Gizle</button>
                                                            <button type="button" className="btn btn-sm btn-warning">Düzenle</button>
                                                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleDelete(file.id)}>Sil</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {file.description && (

                                                    <tr>
                                                        <td colSpan={5} >
                                                            <strong>Açıklama : </strong>{file.description}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            :
                            (
                                <p className="text-muted text-center">Yayınlanan dosya yok</p>
                            )
                        }
                    </div>
                </>

            )}
            {page == 'hide' && (
                <>
                    <h5 className="text-center">Gizlenen Dosyalar</h5>
                    <div className="row justify-content-center">
                        {hideFiles.length > 0 ?
                            (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Dosya Adı</th>
                                            <th scope="col">Dizin</th>
                                            <th scope="col">Yükleyen</th>
                                            <th scope="col">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hideFiles.map((file, i) => (
                                            <React.Fragment key={i}>
                                                <tr className=''>
                                                    <th scope="row">1</th>
                                                    <td>{file.filename}</td>
                                                    <td>{file.category_path}</td>
                                                    <td>{file.username}</td>
                                                    <td>
                                                        <a type="button" href={file.full_url} className="btn btn-sm btn-primary me-1">Görüntüle</a>

                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleReApprove(file.id)} >Yeniden Yayınla</button>
                                                            <button type="button" className="btn btn-sm btn-warning">Düzenle</button>
                                                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleDelete(file.id)}>Sil</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {file.description && (

                                                    <tr>
                                                        <td colSpan={5} >
                                                            <strong>Açıklama : </strong>{file.description}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            :
                            (
                                <p className="text-muted text-center">Gizlenen dosya yok</p>
                            )
                        }
                    </div>
                </>

            )}

        </>
    )
}

export default PendingFiles