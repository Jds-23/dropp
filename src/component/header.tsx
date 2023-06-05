import Link from 'next/link'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
const Header = () => {
  return (
    <div style={{
      padding: "0.5rem",
    }} className='fixed top-0 items-center w-full p-4 border-b border-b-slate-500 flex justify-between'>
        <Link href={"/"} className="container">
        💨💧
        </Link>
        <ConnectButton />
    </div>
  )
}

export default Header