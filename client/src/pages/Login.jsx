import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/UserSlice';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function LoginPage() {
  const [username, setUsername] = useState('tunaunal');
  const [password, setPassword] = useState('1');

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Kullanıcı adı ve şifre alanları zorunludur.',
      });
      return;
    }

    try {
      console.log('Giriş isteği gönderiliyor...');
      const resultAction = await dispatch(login({ username, password })).unwrap();
      console.log('Giriş başarılı, dönen veri:', resultAction);

      if (location) {
        <Navigate to={location.pathname + location.search} replace></Navigate>;
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      Swal.fire({
        icon: 'error',
        title: 'Giriş Başarısız',
        text: err.message || 'Kullanıcı adı veya şifre hatalı.',
      });
    }
  };
  return (
    <>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <h3>Hızlı Giriş (Geliştirme Ortamı)</h3>
                <div className="alert alert-primary d-flex justify-content-between">
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setUsername('tunaunal');
                      setPassword('1');
                      handleLogin;
                    }}
                  >
                    Tuna Ünal
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setUsername('talebe');
                      setPassword('1');
                      handleLogin;
                    }}
                  >
                    Talebe
                  </button>
                </div>
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Hesabına giriş yap</h5>
                        <p className="text-center small">Enter your username & password to login</p>
                      </div>
                      <form className="row g-3 needs-validation" noValidate>
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">
                            Username
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="text"
                              name="username"
                              className="form-control"
                              id="yourUsername"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                            <div className="invalid-feedback">Please enter your username.</div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        {/*
												   
												<div className="col-12">
												  <div className="form-check">
													<input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
													<label className="form-check-label" for="rememberMe">Remember me</label>
												  </div>
												</div>
													  */}
                        <div className="col-12">
                          <button className="btn btn-primary w-100" onClick={(e) => handleLogin(e)}>
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="credits">
                    {/*
										    
										<!-- All the links in the footer should remain intact. -->
										<!-- You can delete the links only if you purchased the pro version. -->
										<!-- Licensing information: https://bootstrapmade.com/license/ -->
										<!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
										Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
											*/}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
