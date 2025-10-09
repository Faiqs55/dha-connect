import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"

function App() {

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
