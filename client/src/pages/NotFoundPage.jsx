import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';

function NotFoundPage() {
    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <h1>404</h1>
                    <h2>Aradığınız sayfa bulunamadı.</h2>
                    <p className="text-muted">Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
                    <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default NotFoundPage;