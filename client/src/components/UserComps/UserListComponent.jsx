import React, { useState, useEffect, useMemo } from 'react'; // useMemo'yu import et
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserList } from '../../store/UserSlice';
import { fetchKurumlar } from '../../store/KurumSlice';
import { fetchMintikalar } from '../../store/MintikaSlice';
import { AdminControl, DirectorControl } from '../GeneralComponents/AdminRoute';
export default function UserListComponent() {
  const dispatch = useDispatch();
  const isAdmin = AdminControl();
  const isDirector = DirectorControl();

  const { userList, user, loading, error } = useSelector((store) => store.user);
  const { kurumList } = useSelector((store) => store.kurum);
  const { mintikaList } = useSelector((store) => store.mintika);

  const [filters, setFilters] = useState({
    kurumId: '',
    mintikaId: isAdmin ? '' : user.mintika_id,
  });
  console.log(user.mintika_id);

  useEffect(() => {
    dispatch(fetchUserList());
    if (isDirector || isAdmin) dispatch(fetchKurumlar());
    if (isAdmin) dispatch(fetchMintikalar());
  }, [dispatch, isAdmin, isDirector]);

  const filteredKurumList = useMemo(() => {
    if (!filters.mintikaId) {
      return [];
    }

    return kurumList.filter((kurum) => kurum.mintika_id == filters.mintikaId);
  }, [filters.mintikaId, kurumList]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };

      // Eğer değişen filtre 'mintikaId' ise, kurum seçimini sıfırla.
      // Bu, tutarsız bir seçimin kalmasını engeller.
      if (name === 'mintikaId') {
        newFilters.kurumId = '';
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({ kurumId: '', mintikaId: '' });
  };

  // Client-side filtreleme için `useMemo`
  const filteredUserList = useMemo(() => {
    if (!userList) return [];
    return userList.filter((user) => {
      const kurumMatch = filters.kurumId ? user.kurum_id == filters.kurumId : true;
      const mintikaMatch = filters.mintikaId ? user.mintika_id == filters.mintikaId : true;
      return kurumMatch && mintikaMatch;
    });
  }, [userList, filters]);

  // Yükleme ve Hata durumu...
  if (loading) return <p>Veriler yükleniyor...</p>;
  if (error) return <div className="alert alert-danger">Hata: {error}</div>;

  return (
    <>
      {(isAdmin || isDirector) && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Filtrele</h5>
            <form className="row g-3 align-items-end">
              {isAdmin && (
                <div className="col-md-4 col-lg-3">
                  <label htmlFor="mintikaId" className="form-label">
                    Mıntıka
                  </label>
                  <select
                    name="mintikaId"
                    id="mintikaId"
                    className="form-select"
                    value={filters.mintikaId}
                    onChange={handleFilterChange}
                  >
                    <option value="">Seçiniz...</option>
                    {mintikaList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {(isDirector || isAdmin) && (
                <div className="col-md-4 col-lg-3">
                  <label htmlFor="kurumId" className="form-label">
                    Kurum
                  </label>
                  <select
                    name="kurumId"
                    id="kurumId"
                    className="form-select"
                    value={filters.kurumId}
                    onChange={handleFilterChange}
                    disabled={!filters.mintikaId}
                  >
                    <option value="">
                      {filters.mintikaId ? 'Seçiniz...' : 'Önce Mıntıka Seçin'}
                    </option>
                    {/* Artık tam `kurumList` yerine filtrelenmiş olanı kullanıyoruz */}
                    {filteredKurumList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="col">
                <button type="button" className="btn btn-danger float-end" onClick={clearFilters}>
                  Filtreleri Temizle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sonuçlar Tablosu */}
      <div className="card mt-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Kullanıcı Listesi ({filteredUserList.length} Sonuç)</h5>
          <Link to="/user/create" className="btn btn-primary btn-sm">
            <i className="bi bi-person-plus-fill me-1"></i> Yeni Kullanıcı Ekle
          </Link>
        </div>
        <div className="card-body">
          <div className="card-body">
            {filteredUserList.length === 0 ? (
              <div className="alert alert-info mt-3">Filtrelere uygun kullanıcı bulunamadı.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>İsim</th>
                      <th>Rol</th>
                      <th>Mıntıka</th>
                      <th>Kurum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserList.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>{user.role}</td>
                        <td>{user.mintika_name || '-'}</td>
                        <td>{user.kurum_name || '-'}</td>
                        <td>
                          <Link to={`/user/${user.id}`} className="btn btn-primary btn-sm mx-2">
                            Detay
                          </Link>
                          <Link to={`/user/edit/${user.id}`} className="btn btn-warning btn-sm">
                            Düzenle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
