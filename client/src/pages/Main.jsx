import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';
import { useSelector } from 'react-redux';

function Main() {
  const { user } = useSelector((state) => state.user);

  // Widget verileri
  const widgets = [
    { title: 'Belgeler', value: '4000+', icon: 'bi-file-earmark-text', color: 'primary' },
    { title: 'Kullanıcılar', value: '80+', icon: 'bi-people', color: 'success' },
    { title: 'Yüklediklerim', value: '12', icon: 'bi-upload', color: 'warning' },
    { title: 'İndirmeler', value: '87', icon: 'bi-download', color: 'danger' },
  ];

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        {/* Sayfa Başlığı */}
        <div className="pagetitle">
          <h1>Ana Sayfa</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Anasayfa</a>
              </li>
              <li className="breadcrumb-item active">Genel Bakış</li>
            </ol>
          </nav>
        </div>

        {/* Üst Karşılama Kartı */}
        <section className="section dashboard">
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                  <div>
                    <h2>
                      Merhaba, {user.name} {user.surname}
                    </h2>
                    <h5 className="text-muted">Esenler Öğrenci Yurdu</h5>
                  </div>
                  <div>
                    <i
                      className="bi bi-house-door"
                      style={{ fontSize: '40px', color: '#2a68ff' }}
                    ></i>
                  </div>
                </div>
              </div>

              {/* Widgetlar */}
              <div className="row g-3">
                {widgets.map((widget, idx) => (
                  <div key={idx} className="col-xxl-3 col-md-6">
                    <div className={`card text-white bg-${widget.color} h-100`}>
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div>
                          <h5 className="card-title">{widget.title}</h5>
                          <h3>{widget.value}</h3>
                        </div>
                        <i
                          className={`bi ${widget.icon}`}
                          style={{ fontSize: '40px', opacity: 0.7 }}
                        ></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Main;
