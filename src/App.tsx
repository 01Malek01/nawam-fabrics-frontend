import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ScrollToTop from "./components/ScrollToTop";
import BottomMobileNavbar from "./components/BottomMobileNavbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FabricPage from "./pages/FabricPage";
import ProductsPage from "./pages/ProductsPage";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Shipping from "./pages/Shipping";
import Complaints from "./pages/Complaints";
import FabricTypes from "./pages/FabricTypes";
import Branches from "./pages/Branches";
import WashingInstructions from "./pages/WashingInstructions";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import Unauthorized from "./pages/Unauthorized";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import LastPieces from "./pages/LastPieces";
import LastPiecePage from "./pages/LastPiecePage";
import Signup from "./pages/Signup";
import BottomCartDrawer from "./components/cart/BottomCartDrawer.js";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col  md:px-10">
        <Navbar />
        <BottomCartDrawer />

        <main className="flex-1">
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/fabric/:fabricId" element={<FabricPage />} />
            <Route
              path="/categories/:categoryId/:subCategoryId"
              element={<ProductsPage />}
            />
            <Route path="/categories/:categoryId" element={<ProductsPage />} />
            <Route path="/lastpieces" element={<LastPieces />} />
            <Route path="/lastpieces/:id" element={<LastPiecePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/fabric-types" element={<FabricTypes />} />
            <Route path="/branches" element={<Branches />} />
            <Route
              path="/washing-instructions"
              element={<WashingInstructions />}
            />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <BottomMobileNavbar />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
