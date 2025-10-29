import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCategories } from '../../store/FileSlice';
import Files from './Files';

export default function StorageComponent() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.files);
  const [currentCategoryID, setCurrentCategoryID] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const subCategories = categories.filter((cat) => cat.parent_id === currentCategoryID);

  const changeCategory = (id) => {
    setCurrentCategoryID(id);
    setCurrentCategory(findCategory(id));
  };

  const findCategory = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category : null;
  };

  const findBreadcrumbs = (id) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      if (category.parent_id === -1) {
        return [category];
      } else {
        return [...findBreadcrumbs(category.parent_id), category];
      }
    } else {
      return [];
    }
  };
  const breadcrumbs = findBreadcrumbs(currentCategoryID);

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Hata: {error}</div>;
  }

  return (
    <div className="card">
      <div className="card-header ">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Dosya Merkezi</h5>
          <Link to="/upload" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-circle me-1"></i> Dosya Yükle
          </Link>
        </div>
        <div>
          {breadcrumbs.length > 0 ? (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                {breadcrumbs.map((cat, index) => (
                  <li
                    key={cat.id}
                    className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                    aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                    onClick={() => index !== breadcrumbs.length - 1 && changeCategory(cat.id)}
                    style={{ cursor: index !== breadcrumbs.length - 1 ? 'pointer' : 'default' }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <span>Ana Kategori</span>
          )}
        </div>
      </div>
      <div className="card-body">
        {subCategories.length === 0 && currentCategory?.can_upload == 0 ? (
          <div className="alert alert-info mt-3">Gösterilecek kategori bulunmamaktadır.</div>
        ) : (
          <div className="">
            {subCategories.map((cat) => (
              <div
                className="alert alert-warning alert-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => changeCategory(cat.id)}
                key={cat.id}
              >
                <img src="/folder.png" className="pe-2" alt="" style={{ height: '25px' }} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        )}
        <hr />
        {currentCategory?.can_upload == 1 && <Files id={currentCategoryID}></Files>}
      </div>
    </div>
  );
}
