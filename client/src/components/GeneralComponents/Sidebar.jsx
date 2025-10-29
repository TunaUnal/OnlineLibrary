import React from 'react';
import { Link } from 'react-router-dom';
import { AdminControl, DirectorControl, ManagerControl } from '../AdminRoute'; // Bu component'in yolunun doğru olduğunu varsayıyorum

function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar offcanvas-lg offcanvas-start" tabIndex="-1">
      {/* sidebar-nav'ı bir d-flex ve flex-column'a dönüştürüyoruz */}
      <ul className="sidebar-nav d-flex flex-column" id="sidebar-nav" style={{ height: '100%' }}>
        <div>
          {' '}
          {/* Bu div, menü elemanlarını gruplayacak */}
          <li className="nav-item">
            <a className="nav-link" href="/">
              <i className="bi bi-grid"></i>
              <span>Ana Sayfa</span>
            </a>
          </li>
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/storage">
              <i className="bi bi-signpost"></i>
              <span>Dosya Merkezi</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/files">
              <i className="bi bi-clipboard-data"></i>
              <span>Dosyalarım</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/upload">
              <i className="bi bi-clipboard-data"></i>
              <span>Dosya Yükle</span>
            </Link>
          </li>
          {AdminControl() && (
            <>
              <li className="nav-heading">YÖNETİM</li>
              <li className="nav-item">
                <Link className="nav-link collapsed" to="/pending">
                  <i className="bi bi-clock"></i>
                  <span>Bekleyen Dosyalar</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link collapsed" to="/manage">
                  <i className="bi bi-archive"></i>
                  <span>Dosya Yöneticisi</span>
                </Link>
              </li>
              <li className="nav-heading">Raporlar</li>
            </>
          )}
        </div>

        <span className="mt-auto p-3 text-center">
          <img src="/logo.jpg" style={{ width: '220px' }} alt="IFA Logo" />
        </span>
      </ul>
    </aside>
  );
}

export default Sidebar;
