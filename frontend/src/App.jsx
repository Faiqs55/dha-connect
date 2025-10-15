import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AddAgencyDhaPlus from "./pages/Dashboard/AddAgency";
import Agency from "./pages/Agency";
import PropertyDetail from "./pages/PropertyDetail";
import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import Required from "./pages/Required";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sale/:category" element={<Sale/>} />
        <Route path="/rent/:category" element={<Rent/>} />
        <Route path="/required/:category" element={<Required/>} />
        <Route path="/agency/:id" element={<Agency/>} />
        <Route path="/property/:id" element={<PropertyDetail/>} />
        <Route path="/dashboard">
          <Route path="/dashboard/agency">
            <Route
              path="/dashboard/agency/add"
              element={<AddAgencyDhaPlus />}
            />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
