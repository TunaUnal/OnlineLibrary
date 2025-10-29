import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUser, updateUser, fetchUserById, clearSelectedUser } from '../../store/UserSlice';
import { fetchKurumlar } from '../../store/KurumSlice';
import { fetchMintikalar } from '../../store/MintikaSlice';
import { AdminControl, DirectorControl } from '../GeneralComponents/AdminRoute';
function UserFormComponent({ userID }) {
  // Düzenleme modunda ID'yi prop olarak alır
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = AdminControl();
  const isDirector = DirectorControl();
  // Redux store'dan gerekli state'leri çek
  const {
    user: currentUser,
    isSubmitting,
    error,
    selectedUser,
  } = useSelector((state) => state.user);
  const { kurumList } = useSelector((state) => state.kurum);
  const { mintikaList } = useSelector((state) => state.mintika);

  const isEditMode = !!userID; // Eğer bir ID varsa, düzenleme modundayız

  // Form state'i, başlangıçta boş veya düzenleme modunda doldurulacak
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    username: '',
    password: '', // Yeni şifre alanı
    role: '',
    kurum_id: '',
    mintika_id: '',
    phone: '',
  });

  // Sayfa yüklendiğinde veri çekme ve başlangıç state'ini ayarlama
  useEffect(() => {
    // Dropdown'lar için listeleri çek
    dispatch(fetchMintikalar());
    dispatch(fetchKurumlar());

    // Eğer düzenleme modundaysak, mevcut kullanıcı verisini çek
    if (isEditMode) {
      dispatch(fetchUserById(userID));
    }

    // Component kaldırıldığında seçili kullanıcı state'ini temizle
    return () => {
      if (isEditMode) dispatch(clearSelectedUser());
    };
  }, [dispatch, userID, isEditMode]);

  // API'dan kullanıcı verisi geldiğinde, formu doldur
  useEffect(() => {
    if (isEditMode && selectedUser) {
      setFormData({
        id: selectedUser.id,
        name: selectedUser.name,
        username: selectedUser.username,
        password: '', // Şifre alanını boş bırak, güvenlik için
        role: selectedUser.role,
        kurum_id: selectedUser.kurum_id,
        mintika_id: selectedUser.mintika_id,
        phone: selectedUser.phone,
      });
    }
    if (!isAdmin) {
      setFormData((prev) => {
        return { ...prev, mintika_id: currentUser.mintika_id };
      });
    }
    if (!isAdmin && !isDirector) {
      setFormData((prev) => {
        return { ...prev, mintika_id: currentUser.mintika_id, kurum_id: currentUser.kurum_id };
      });
    }
  }, [selectedUser, isEditMode]);

  // Rolleri tanımla
  const roles = ['Admin', 'Mıntıka Yöneticisi', 'Kurum Yöneticisi', 'Kullanıcı'];

  // Filtrelenmiş kurum listesi (Mıntıka seçimine göre)
  const filteredKurumList = useMemo(() => {
    if (!formData?.mintika_id) return [];
    return kurumList.filter((kurum) => kurum.mintika_id == formData.mintika_id);
  }, [formData?.mintika_id, kurumList]);

  // Input değişimlerini yönet
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      // Eğer mıntıka değiştiyse, kurum seçimini sıfırla
      if (name === 'mintika_id') {
        newFormData.kurum_id = '';
      }
      return newFormData;
    });
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basit zorunlu alan kontrolü
    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.role ||
      !formData.kurum_id ||
      !formData.mintika_id
    ) {
      Swal.fire('Uyarı', 'Zorunlu alanları doldurun.', 'warning');
      return;
    }

    try {
      if (isEditMode) {
        // Düzenleme modu: updateUser thunk'ını çağır
        await dispatch(updateUser({ userId: userID, userData: formData })).unwrap();
        await Swal.fire('Başarılı!', 'Kullanıcı bilgileri güncellendi.', 'success');
        navigate(`/user/${userID}`); // Detay sayfasına yönlendir
      } else {
        // Ekleme modu: createUser thunk'ını çağır
        await dispatch(createUser(formData)).unwrap();
        await Swal.fire('Başarılı!', 'Kullanıcı başarıyla oluşturuldu.', 'success');
        navigate('/user/list'); // Kullanıcı listesi sayfasına yönlendir
      }
    } catch (err) {
      Swal.fire('Hata!', err.message || 'İşlem sırasında bir sorun oluştu.', 'error');
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          {isEditMode ? formData.name + ' kullanıcısını Düzenle' : 'Yeni Kullanıcı Bilgileri'}
        </h5>
        {/* Geri gitme veya iptal linki */}
        <Link
          to={isEditMode ? `/user/${userID}` : '/user/list'}
          className="btn btn-secondary btn-sm"
        >
          {isEditMode ? 'İptal' : 'Listeye Dön'}
        </Link>
      </div>
      <div className="card-body mt-3">
        {/* Yükleme, Hata veya veri gelmediyse */}
        {isSubmitting && <div>İşleniyor...</div>}
        {!formData && !isSubmitting && <p>Form verisi yüklenemedi.</p>}

        {formData && ( // Sadece formData yüklendiğinde formu göster
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Mıntıka Seçimi - Admin ve Director için */}
            {isAdmin && (
              <div className="col-md-6">
                <label htmlFor="mintika_id" className="form-label">
                  Mıntıka <span className="text-danger">*</span>
                </label>
                <select
                  id="mintika_id"
                  name="mintika_id"
                  className="form-select"
                  value={formData.mintika_id}
                  onChange={handleChange}
                  required
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

            {/* Kurum Seçimi - Admin, Director ve Manager için */}
            {isDirector && (
              <div className="col-md-6">
                <label htmlFor="kurum_id" className="form-label">
                  Kurum <span className="text-danger">*</span>
                </label>
                <select
                  id="kurum_id"
                  name="kurum_id"
                  className="form-select"
                  value={formData.kurum_id}
                  onChange={handleChange}
                  disabled={
                    !formData.mintika_id || (isEditMode && currentUser.role === 'Kurum Yöneticisi')
                  }
                  required
                >
                  <option value="">
                    {formData.mintika_id ? 'Seçiniz...' : 'Önce Mıntıka Seçin'}
                  </option>
                  {(!isEditMode || (isEditMode && formData.mintika_id)) &&
                    (isAdmin || isDirector
                      ? filteredKurumList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.name}
                          </option>
                        ))
                      : kurumList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.name}
                          </option>
                        )))}
                </select>
              </div>
            )}
            <hr className="col-12" />

            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                İsim Soyisim <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="username" className="form-label">
                Kullanıcı Adı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="password" className="form-label">
                Şifre {isEditMode ? '' : <span className="text-danger">*</span>}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditMode ? 'Değiştirmek istemiyorsanız boş bırakın' : 'Şifre girin'}
                required={!isEditMode}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="role" className="form-label">
                Rol <span className="text-danger">*</span>
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Seçiniz...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="phone" className="form-label">
                Telefon Numarası
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'İşleniyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserFormComponent;
