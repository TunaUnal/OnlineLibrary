import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  if (!user) return <p>Yükleniyor…</p>;
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function AdminControl() {
  const { user } = useSelector((state) => state.user);
  if (!user) return false;
  return user.role == 'admin' ? true : false;
}

//! Mıntıka yöneticisi yetki alanı
export function DirectorRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  if (!user) return <p>Yükleniyor…</p>;
  if (user.role !== 'Mıntıka Yöneticisi' && user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function DirectorControl() {
  const { user } = useSelector((state) => state.user);
  if (!user) return false;
  return user.role == 'Mıntıka Yöneticisi' || user.role == 'Admin';
}

//! Kurum yöneticisi yetki alanı
export function ManagerRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  if (!user) return <p>Yükleniyor…</p>;
  if (
    user.role !== 'Kurum Yöneticisi' &&
    user.role !== 'Mıntıka Yöneticisi' &&
    user.role !== 'Admin'
  ) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function ManagerControl() {
  const { user } = useSelector((state) => state.user);
  if (!user) return false;
  return user.role == 'Kurum Yöneticisi' ||
    user.role == 'Mıntıka Yöneticisi' ||
    user.role == 'Admin'
    ? true
    : false;
}
