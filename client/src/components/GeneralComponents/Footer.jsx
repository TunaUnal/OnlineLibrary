import React from 'react';

function Footer() {
  return (
    <>
      <footer
        id="footer"
        className="footer"
        style={{ position: 'fixed', bottom: 0, width: '-webkit-fill-available' }}
      >
        <div className="copyright text-center">
          2025 ©{' '}
          <strong>
            <span>Esenler Öğrenci Yurdu</span>
          </strong>
        </div>
      </footer>
    </>
  );
}

export default Footer;
