import React, { useState } from 'react';

/**
 * Yeniden kullanılabilir filtreleme barı componenti.
 * @param {object} props
 * @param {Array} props.users - Select için kullanıcı listesi (örn: [{id: 1, name: 'Admin'}, ...])
 * @param {Array} props.categories - Select için kategori listesi
 * @param {function} props.onApplyFilters - Filtreleri uygulamak için çağrılacak fonksiyon
 * @param {boolean} props.isLoading - Ana component'in yüklenme durumu (butonları disable etmek için)
 */
const FilterBar = ({ users = [], categories = [], onApplyFilters, isLoading }) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [minHits, setMinHits] = useState('');

  const handleApply = () => {
    const newFilters = {};
    if (selectedUser) newFilters.user_id = selectedUser;
    if (selectedCategory) newFilters.categoryId = selectedCategory;
    if (dateRange) newFilters.dateRange = dateRange;
    if (minHits) newFilters.minHits = minHits;
    onApplyFilters(newFilters);
  };

  const handleClear = () => {
    setSelectedUser('');
    setSelectedCategory('');
    setDateRange('');
    setMinHits('');
    onApplyFilters({});
  };

  return (
    <div className="container border rounded p-3 mb-3 bg-light">
      <div className="row g-3 align-items-end">
        {/* Kullanıcı Filtresi */}
        <div className="col-md-3">
          <label htmlFor="user-filter" className="form-label">
            Kullanıcı
          </label>
          <select
            id="user-filter"
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Tüm Kullanıcılar</option>
            {console.log(users)}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategori Filtresi */}
        <div className="col-md-3">
          <label htmlFor="category-filter" className="form-label">
            Kategori
          </label>
          <select
            id="category-filter"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zaman Filtresi */}
        <div className="col-md-3">
          <label htmlFor="date-filter" className="form-label">
            Yüklenme Tarihi
          </label>
          <select
            id="date-filter"
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Tüm Zamanlar</option>
            <option value="last_24_hours">Son 24 Saat</option>
            <option value="last_7_days">Son 7 Gün</option>
            <option value="last_30_days">Son 30 Gün</option>
          </select>
        </div>

        {/* Hit (İndirme Sayısı) Filtresi */}
        <div className="col-md-2">
          <label htmlFor="hits-filter" className="form-label">
            Minimum İndirme
          </label>
          <input
            id="hits-filter"
            type="number"
            className="form-control"
            value={minHits}
            onChange={(e) => setMinHits(e.target.value)}
            placeholder="Örn: 100"
            disabled={isLoading}
          />
        </div>

        {/* Aksiyon Butonları */}
        <div className="col-md-1 d-flex gap-2">
          <button onClick={handleApply} className="btn btn-primary flex-fill" disabled={isLoading}>
            Filtrele
          </button>
          <button
            onClick={handleClear}
            className="btn btn-outline-secondary flex-fill"
            disabled={isLoading}
          >
            Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterBar);
