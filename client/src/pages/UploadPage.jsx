import React from 'react';
import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';
import UploadFile from '../components/UploadComps/UploadPage';

function UploadPage() {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <main id="main" className="main">
        <section className="section dashboard">
          <div className="row">
            <UploadFile></UploadFile>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}

export default UploadPage;
