import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import AddAgencyDhaPlus from "./pages/Dashboard/AddAgency";
import Agency from "./pages/Agency";
import PropertyDetail from "./pages/PropertyDetail";
import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import Required from "./pages/Required";
import Agencies from "./pages/Agencies";
import SocietyMaps from "./pages/SocietyMaps";
import Phase from "./pages/Phase";
import Login from "./pages/Dashboard/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/sale/:category" element={<Sale />} />
        <Route path="/rent/:category" element={<Rent />} />
        <Route path="/required/:category" element={<Required />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/agency/:id" element={<Agency />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/maps" element={<SocietyMaps />} />
        <Route path="/maps/:phase" element={<Phase />} />
          <Route path="/submit-agency" element={<AddAgencyDhaPlus />} />
        <Route path="/dashboard" element={<Dashboard />}>
        </Route>
      </Routes>
    </>
  );
}

export default App;
