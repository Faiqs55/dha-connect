"use client";
import ContainerCenter from '@/components/ContainerCenter';
import Sidebar from '@/components/Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from 'react'
import { FaBarsStaggered } from 'react-icons/fa6'

const adminDashboardLayout = ({children}) => {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {value: token, isLoaded} = useLocalStorage("authToken", null);
        
    useEffect(() => {
        if(isLoaded && !token){
          router.push("/login")
        }
    }, [token, isLoaded, router])

    const clickHandler = () => {
    setSidebarOpen(prev => !prev)
  }

  if(!isLoaded){
    return <div className='text-center text-4xl'>Loading</div>
  }

  return (
    <div className='flex'>
        <Sidebar open={sidebarOpen} />

         <div className='flex-1'>
            {/* HEADER  */}
            <div className="bg-gray-100 px-10 py-5 flex justify-between items-center mb-10">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <FaBarsStaggered onClick={clickHandler} className="lg:hidden" />
            </div>

            <ContainerCenter>
                  {children}
            </ContainerCenter>
         </div>
    </div>
  )
}

export default adminDashboardLayout