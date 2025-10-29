import GetFileIcon from '../FilesPageComponents/GetFileIcon'
function SingleFileForPending({ file }) {
    return (
        <>
            <div className="alert alert-success d-flex justify-content-between">

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

                {file.description && (

                    <tr>
                        <td colSpan={5} >
                            <strong>Açıklama : </strong>{file.description}
                        </td>
                    </tr>
                )}
            </div>
        </>
    )
}

export default SingleFileForPending