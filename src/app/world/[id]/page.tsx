"use client"
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react'

const Page = ({params}:{params:{id:string}}) => {
    // const params = usePathname();
    console.log(params.id)
    return <p>Post:{params.id} </p>;}

export default Page