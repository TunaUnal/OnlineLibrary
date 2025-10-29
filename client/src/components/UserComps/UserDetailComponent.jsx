import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserById, clearSelectedUser } from '../../store/UserSlice';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Belirtilen ID'ye sahip kullanıcının detaylarını ve son yolculuklarını gösteren bileşen.
 * @param {{userID: number|string}} props - Görüntülenecek kullanıcının ID'si.
 */
export default function UserDetailComponent({ userID }) {
  console.log(userID);
  const dispatch = useDispatch();
  const { selectedUser: user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userID) {
      dispatch(fetchUserById(userID));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userID]);

  // Dakikayı "X saat Y dakika" formatına çeviren yardımcı fonksiyon
  const formatDuration = (totalMinutes) => {
    if (totalMinutes === null || isNaN(totalMinutes)) {
      return '-';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) {
      result += `${hours} saat `;
    }
    result += `${minutes} dakika`;
    return result;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Hata: {error}</div>;
  }

  if (!user) {
    return <div className="alert alert-warning">Kullanıcı bilgileri bulunamadı.</div>;
  }

  return (
    <>
      {/* --- KULLANICI PROFİL KARTI --- */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Kullanıcı Profili: {user.name}</h5>
          <Link to={`/user/edit/${user.id}`} className="btn btn-primary btn-sm">
            <i className="bi bi-pencil-square me-1"></i> Profili Düzenle
          </Link>
        </div>
        <div className="card-body pt-3">
          {/* ... (Bir önceki cevaptaki profil detayları aynı) ... */}
          <div className="row">
            <div className="col-lg-3 col-md-4 label fw-bold">İsim Soyisim</div>
            <div className="col-lg-9 col-md-8">{user.name}</div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 col-md-4 label fw-bold">Kullanıcı Adı</div>
            <div className="col-lg-9 col-md-8">{user.username}</div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 col-md-4 label fw-bold">Rol</div>
            <div className="col-lg-9 col-md-8">{user.role}</div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 col-md-4 label fw-bold">Mıntıka</div>
            <div className="col-lg-9 col-md-8">{user.mintika_name || '-'}</div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 col-md-4 label fw-bold">Kurum</div>
            <div className="col-lg-9 col-md-8">{user.kurum_name || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title mb-0">Son 10 Yolculuk</h5>
        </div>
        <div className="card-body pt-3">
          {user.trip_history && user.trip_history.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover">
                <thead>
                  <tr>
                    <th>Araç</th>
                    <th>Destinasyon</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    <th>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  {user.trip_history.map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        <strong>{trip.plate}</strong>
                        <br />
                        <small className="text-muted">
                          {trip.brand} {trip.model}
                        </small>
                      </td>
                      <td>{trip.destination}</td>
                      <td>{format(new Date(trip.start_date), 'dd.MM.yy HH:mm', { locale: tr })}</td>
                      <td>
                        {trip.end_date
                          ? format(new Date(trip.end_date), 'dd.MM.yy HH:mm', { locale: tr })
                          : '-'}
                      </td>
                      <td>{formatDuration(trip.duration_minutes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-light text-center" role="alert">
              Bu kullanıcının tamamlanmış bir yolculuk geçmişi bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
