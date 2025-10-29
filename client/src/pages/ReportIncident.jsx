import React from 'react'
import ReportIncidentForm from '../components/ReportIncidentComponents/ReportInicdentForm'
import Header from '../components/GeneralComponents/Header'
import Sidebar from '../components/GeneralComponents/Sidebar'
import Footer from '../components/GeneralComponents/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
function ReportIncident() {
    return (
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <main id='main' className='main'>
                <div className='pagetitle'>
                    <h1>Kaza / Arıza Bildir </h1>
                    <nav><ol className='breadcrumb'><li className='breadcrumb-item'><a href='index.html'>Anasayfa</a></li><li className='breadcrumb-item active'>Genel Bakış</li></ol></nav>
                </div>
                <section className='section dashboard'>
                    <div className='row'>
                        <div className='col-12'>
                            <ReportIncidentForm></ReportIncidentForm>
                        </div>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default ReportIncident