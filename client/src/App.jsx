import './assets/style.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Main from './pages/Main';
import NotFoundPage from './pages/NotFoundPage';
import { AdminRoute } from './components/AdminRoute';
import PendingFilesPage from './pages/AdminPage/PendingFilesPage';
import StoragePage from './pages/StoragePage';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import FileManagerPage from './pages/AdminPage/FileManagerPage';
import { checkSession } from './store/UserSlice';
function App() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  if (!user.status) {
    return <LoginPage></LoginPage>;
  } else {
    return (
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/storage" element={<StoragePage />}></Route>
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/files" element={<MyFilesPage />}></Route>
          <Route element={<AdminRoute />}>
            <Route path="/manage" element={<FileManagerPage />}></Route>
            <Route path="/pending" element={<PendingFilesPage />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;
