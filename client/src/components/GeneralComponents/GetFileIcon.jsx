import React, { useState } from 'react'

function GetFileIcon({ filename }) {

    const [icon, setIcon] = useState(() => {
        switch (filename.ext) {
            case 'pdf':
                return '/pdf.png'
                break;
            case 'xlsx':
                return '/xlsx.png'
                break;
            case 'xls':
                return '/xlsx.png'
                break;
            case 'pptx':
                return '/pptx.png'
                break;
            case 'word':
                return '/word.png'
                break;
            case 'png':
                return '/png.png'
                break;
            case 'jpeg':
                return '/png.png'
                break;
            case 'jpg':
                return '/png.png'
                break;

            default:
                return '/png.png'
                break;
        }

    })

    return (
        <>
            <img src={icon} alt="a" style={{ height: "25px" }} />
        </>
    )
}

export default GetFileIcon