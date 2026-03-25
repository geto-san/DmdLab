import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Header />}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

export default App;
