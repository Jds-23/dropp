"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { parseAbi, parseUnits } from 'viem';
import { useAccount, useBalance, useContractWrite, useToken } from 'wagmi';

const Page = ({params}:{params:{id:string}}) => {
    const {address:userAddress,isConnected}=useAccount()
    const tokenAddress:`0x${string}`=`0x${params.id.replace(/^0x/, '')}`;
    const [amount,setAmount]=useState<string>("0")

    const { data:tokenData}=useToken({
        address: tokenAddress,
    })
    const { data:tokenBalance,refetch}=useBalance({
        address: userAddress,
        token:tokenAddress
    })

    const amountNumber = parseFloat(amount)
    const amountWei =tokenData&& parseUnits(`${Number.isNaN(amountNumber)?0:amountNumber}`, tokenData.decimals )
  

    const { writeAsync: mint } = useContractWrite({
        address: tokenData?.address,
        abi: parseAbi(['function mint(address to, uint256 amount) public']),
        functionName: 'mint',
        args:userAddress&&amountWei!==undefined? [userAddress, amountWei]:undefined
    })
// if user is not connected to wallet, show connect button
if(!isConnected)
return (
  <div className='mt-24'>
    <div className='flex flex-col items-center justify-center'>
      </div>
      <ConnectButton/>
      </div>
)
    return         <div className='mt-24'>
    <div className='flex flex-col items-center justify-center'>
      <div className='text-4xl font-bold text-center max-w-lg'>
        Mint {tokenData?.name} 
</div>
      <div className='text-xl font-bold text-center max-w-lg'>
        Address: {tokenData?.address} 
</div>
<div className='flex items-center justify-center'>

<div className='text-4xl font-bold text-center max-w-lg'>
      Your Balance:  {tokenBalance?.formatted} {tokenBalance?.symbol}
</div>

<button className='text-white' onClick={()=>{
    refetch()
}}>
    Refresh
</button>
</div>
<input value={amount} onChange={e=>{
                        // regex to only allow decimal numbers
      if (e.target.value.match(/^\d*\.?\d*$/)) {
                setAmount(e.target.value)
      }
                }} className='border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black' placeholder='Enter Amount' />

<button className='mt-8 px-8 py-4 bg-blue-500 rounded-lg text-white font-bold' onClick={() => {
    mint()
}
}>
    'Mint'
</button>
</div>
</div>}

export default Page