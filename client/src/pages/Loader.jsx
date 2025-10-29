import Header from "../components/GeneralComponents/Header"
import Sidebar from "../components/GeneralComponents/Sidebar"
import Footer from "../components/GeneralComponents/Footer"


function Loader() {

    return (
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <main id="main" className="main">
                <section className="section dashboard">
                    <div className="row">
                        
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}


export default Loader