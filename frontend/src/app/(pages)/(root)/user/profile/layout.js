"use client";
import useAuthStore from '@/store/auth.store'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Spinner from '@/Components/Spinner';

const Layout = ({children}) => {

    const userToken = useAuthStore(state => state.token);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if(!userToken){
           router.push("/")
        }else{
            setLoading(false)
        }
    }, [userToken]);


    if (loading) {
    return <Spinner/>;
  }

  return (
    <>
        {children}
    </>
  )
}

export default Layout