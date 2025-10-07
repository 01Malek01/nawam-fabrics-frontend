import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FabricPage from "./pages/FabricPage";
import ProductsPage from "./pages/ProductsPage";
import FAQ from "./pages/FAQ";
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col px-10">
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
