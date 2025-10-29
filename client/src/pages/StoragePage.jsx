import React from 'react';
import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import VehicleListComponent from '../components/StorageComps/StorageComponent';
import { Link } from 'react-router-dom';
import StorageComponent from '../components/StorageComps/StorageComponent';
export default function StoragePage() {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dosya Merkezi</h1>
        </div>
        <section className="section dashboard">
          <div className="row">
            <div className="col-12">
              <StorageComponent></StorageComponent>
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}
