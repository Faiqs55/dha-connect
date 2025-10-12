import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AddAgencyDhaPlus from "./pages/Dashboard/AddAgency";
import Agency from "./pages/Agency";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agency/:id" element={<Agency/>} />
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
