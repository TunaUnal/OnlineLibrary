import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Eğer tek sayfa varsa veya hiç sayfa yoksa, hiçbir şey gösterme.
  }

  return (
    <div className="pagination-controls">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        &laquo; Geri
      </button>

      <span>
        Sayfa <strong>{currentPage}</strong> / {totalPages}
      </span>

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        İleri &raquo;
      </button>
    </div>
  );
};

export default Pagination;
