import React from 'react';
import Header from '../../components/GeneralComponents/Header';
import Sidebar from '../../components/GeneralComponents/Sidebar';
import Footer from '../../components/GeneralComponents/Footer';
import PendingFiles from '../../components/PendingFilesComps/PendingFiles';

function PendingFilesPage() {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <main id="main" className="main">
        <section className="section dashboard">
          <div className="row">
            <PendingFiles></PendingFiles>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}

export default PendingFilesPage;
