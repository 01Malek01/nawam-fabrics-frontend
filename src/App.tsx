import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
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
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col px-2 md:px-10">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/fabric/:fabricId" element={<FabricPage />} />
            <Route
              path="/categories/:categoryId/:subCategoryId"
              element={<ProductsPage />}
            />
            <Route path="/categories/:categoryId" element={<ProductsPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/fabric-types" element={<FabricTypes />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/washing-instructions" element={<WashingInstructions />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
