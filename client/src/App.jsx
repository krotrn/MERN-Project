import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";

const App = () => {
    return (
        <>
            {/* Toast notifications */}
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                theme="colored" 
            />
            
            
            {/* Main Content Area */}
            <main className="py-3">
                <Outlet />
            </main>
            {/* Navigation Bar */}
            <Navigation />
        </>
    );
};

export default App;
