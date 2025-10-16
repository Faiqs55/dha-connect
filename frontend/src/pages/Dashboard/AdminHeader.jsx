import {useRef, useState, useEffect} from 'react'
import ContainerCenter from '../../Components/ContainerCenter'
import { FaBarsStaggered } from 'react-icons/fa6'
import logo from "../../../public/dha-connect-logo.png";

const AdminHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const headerRef = useRef(null);

    // Calculate navbar height after component mounts
      useEffect(() => {
        if (headerRef.current) {
          setNavbarHeight(headerRef.current.offsetHeight);
        }
    
        // Update height on window resize
        const handleResize = () => {
          if (headerRef.current) {
            setNavbarHeight(headerRef.current.offsetHeight);
          }
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    const clickHandler = () => {
        setMenuOpen(prev => !prev);
    }
  return (
    <>
    <div className={`sideBar z-20 h-[100vh] duration-300 fixed w-[500px] bg-gray-50  top-0 ${menuOpen ? "left-0" : "left-[-700px]"}`}>

      </div>
      <div className="header shadow fixed h-[100px] w-full z-10 bg-white" ref={headerRef}>
        <ContainerCenter className="py-2.5 flex justify-between items-center">
          <div>
            <img src={logo} className="w-[80px]" alt="" />
          </div>
          <div className="bg-gray-200 px-2.5 py-2 rounded-md cursor-pointer" onClick={clickHandler}>
               <FaBarsStaggered className="text-2xl"/>
          </div>
        </ContainerCenter>
      </div>
      <div style={{ height: `${navbarHeight}px` }}></div>
      </>
  )
}

export default AdminHeader