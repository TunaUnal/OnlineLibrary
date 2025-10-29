import React from 'react'
import Header from '../components/GeneralComponents/Header'
import Sidebar from '../components/GeneralComponents/Sidebar'
import Footer from '../components/GeneralComponents/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import TripHistoryList from '../components/TripHistoryComponents/TripHistoryList'
function TripHistory() {
    return (
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <main id='main' className='main'>
                <div className='pagetitle'>
                    <h1>Seyehat Geçmişi</h1>
                </div>
                <section className='section dashboard'>
                    <div className='row'>
                        <div className='col-12'>
                            <TripHistoryList></TripHistoryList>
                        </div>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default TripHistory