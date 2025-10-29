import React from 'react';
import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';
import MyFilesList from '../components/MyFilesComponents/MyFilesList';
export default function MyFilesPage() {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <main id="main" className="main">
        <section className="section dashboard">
          <div className="row">
            <MyFilesList />
          </div>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}
