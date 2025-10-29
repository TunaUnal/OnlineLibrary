import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/UserSlice';
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  return (
    <>
      <header id="header" className="header fixed-top d-flex flex-column justify-content-center">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="logo d-flex align-items-center">
              <i className="bi bi-journals me-2"></i>
              <span className="d-none d-lg-block">Online Kütüphane</span>
            </Link>
            <i
              className="bi bi-list toggle-sidebar-btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
              aria-controls="sidebar"
            ></i>
          </div>
          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center m-0" style={{ listStyle: 'none' }}>
              <li className="nav-item dropdown pe-3">
                <a
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <img src="/anonim.webp" alt="Profil" className="rounded-circle" />
                  <span className="d-none d-md-block dropdown-toggle ps-2">{user.name}</span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
                  style={{ zIndex: '1050' }}
                >
                  <li className="dropdown-header text-center">
                    <h6>{user.name}</h6>
                    <span>{user.role_name}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => logoutUser()}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span className="mx-2">Çıkış Yap</span>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default memo(Header);
