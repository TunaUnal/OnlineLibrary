import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../store/FileSlice';
import { motion, AnimatePresence } from 'framer-motion';

function CategoryOptions({
  showModal,
  setShowModal,
  selectedCategoryId,
  selectedCategoryPath,
  setSelectedCategoryId,
  setSelectedCategoryPath,
}) {
  const [openMap, setOpenMap] = useState({}); // { [parentId]: childId }
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.files.categories || []);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Modal kapandığında accordion'u temizlemek istersen:
  useEffect(() => {
    if (!showModal) setOpenMap({});
  }, [showModal]);

  // parent_id -> [cats] map (performans için)
  const categoriesByParent = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      const p = c.parent_id ?? -1;
      if (!map[p]) map[p] = [];
      map[p].push(c);
    });
    return map;
  }, [categories]);

  // verilen id'nin tüm descendant'larının id listesini al
  const collectDescendants = (startId) => {
    const res = [];
    const stack = [startId];
    while (stack.length) {
      const cur = stack.pop();
      const children = categoriesByParent[cur] || [];
      for (const ch of children) {
        res.push(ch.id);
        stack.push(ch.id);
      }
    }
    return res;
  };

  // parentId altındaki child'ı aç/kapat; aynı seviyede sadece 1 açık olur
  const toggleNode = (parentId, childId) => {
    const key = String(parentId);
    setOpenMap((prev) => {
      const prevChild = prev[key];
      // kapatma durumu (aynı child'a tekrar tıklama)
      if (prevChild === childId) {
        const copy = { ...prev };
        // parent seviyesinin açık kaydını sil
        delete copy[key];
        // childId ve onun tüm descendant parent anahtarlarını temizle
        const descendants = collectDescendants(childId);
        delete copy[String(childId)];
        descendants.forEach((d) => delete copy[String(d)]);
        return copy;
      } else {
        // yeni child açılıyor: önce eski sibling'in descendant'larını temizle
        const copy = { ...prev, [key]: childId };
        if (prevChild) {
          const descendants = collectDescendants(prevChild);
          delete copy[String(prevChild)];
          descendants.forEach((d) => delete copy[String(d)]);
        }
        return copy;
      }
    });
  };

  const handleSelect = (catId, path) => {
    setSelectedCategoryId(catId);
    setSelectedCategoryPath(path);
  };

  // recursive renderer
  const renderCategories = (parentId = -1, path = []) => {
    const current = categoriesByParent[parentId] || [];
    if (!current.length) return null;

    return (
      <ul className="list-unstyled ms-2">
        {current.map((cat) => {
          const curPath = [...path, cat.name];
          if (cat.can_upload === 1) {
            // seçilebilir (leaf)
            return (
              <li key={cat.id} className="my-1">
                <div
                  className={`form-check ${selectedCategoryId === cat.id ? 'fw-bold text-primary' : ''}`}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => handleSelect(cat.id, curPath.join('/'))}
                >
                  <span style={{ width: 18, textAlign: 'center' }}>📄</span>
                  <span>{cat.name}</span>
                </div>
              </li>
            );
          } else {
            // accordion node
            const isOpen = openMap[String(parentId)] === cat.id;
            return (
              <li key={cat.id} className="my-1">
                <div
                  onClick={() => toggleNode(parentId, cat.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  className="fw-semibold"
                >
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'inline-block', width: 18, textAlign: 'center' }}
                  >
                    ▶
                  </motion.span>
                  <span>{cat.name}</span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${cat.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {renderCategories(cat.id, curPath)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Kategori Seç</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid #e0e0e0', padding: 8 }}
        >
          {renderCategories()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShowModal(false)}>
          "{selectedCategoryPath || 'Kategori'}" Seç
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CategoryOptions;
