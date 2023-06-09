"use client"
import { TOKEN_FACTORY_ADDRESS } from '@/constants/address'
import useTokenLists from '@/hooks/useTokenLists'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React, { useState } from 'react'
import { createWalletClient, custom, encodeFunctionData, parseAbi } from 'viem'
import { usePrepareContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { useAccount, useChainId, useContractWrite, usePublicClient, useWalletClient } from 'wagmi'
import { getWalletClient } from 'wagmi/dist/actions'

const Create = () => {
    const chainId=useChainId()
const { address:userAddress, isConnected }=useAccount()
const client=usePublicClient()
const { data: walletClient, isError, isLoading } = useWalletClient()
const [tokenList,setTokenList]=useTokenLists()


    const [name,setName]=useState<string>('')
    const [symbol,setSymbol]=useState<string>('')
    const [tokenAddress,setTokenAddress]=useState<`0x${string}`>()
    const [txnHash,setTxnHash]=useState<`0x${string}`>()

    const {data:tokenData}=useToken({
        address: tokenAddress,
    })

    
    
    
    const createToken=async()=>{
        // const walletClient = await getWalletClient({chainId})
    const {result,request}=await client?.simulateContract({
        address: TOKEN_FACTORY_ADDRESS[chainId],
        abi: parseAbi(["function createClone(string name,bytes data) external returns (address)"]),
        functionName: 'createClone',
        args:  ["MintableToken",encodeFunctionData({
            abi: parseAbi(["function initialize(string name,string symbol) external"]),
            functionName: 'initialize',
            args: [name,symbol]
          })] 
    })

    walletClient?.writeContract(request).then((hash)=>{
        setTxnHash(hash)
        client.waitForTransactionReceipt({
            hash
        }).then((receipt)=>{
            setTokenAddress(result)
            setTokenList(result)
    console.log(receipt)
})
        // setTokenAddress(result)
    })

}

// if user is not connected to wallet, show connect button
if(!isConnected)
return (
  <div className='mt-24'>
    <div className='flex flex-col items-center justify-center'>
      </div>
      <ConnectButton/>
      </div>
)



return (
  <div className='mt-24'>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-4xl font-bold text-center max-w-lg'>
            Create Token
            </div>
              </div>
              <div className='text-2xl font-bold text-center max-w-lg'>
                <div className='mt-8'>
                    <div className='flex flex-col items-center justify-center text-black'>
                        <input
                        className='w-full p-3 rounded-lg'
                        placeholder='Token Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        <input
                        className='w-full p-3 rounded-lg'
                        placeholder='Token Symbol'
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        />
                        <button
                        className='w-full p-3 mt-8 rounded-lg bg-green-500'
                        onClick={() => {
                            createToken()
                        }}
                        >
                            Create Token
                        </button>
                    </div>
                    {
                        tokenData&&<div>
                            <div className='flex flex-col items-center justify-center'>
                                <div className='text-2xl font-bold text-center max-w-lg'>
                                    Token Created
                                </div>
                                <div className='text-2xl font-bold text-center max-w-lg'>
                                    <a href={`https://etherscan.io/token/${tokenAddress}`} target="_blank" rel="noopener noreferrer">{tokenData.name} ({tokenData.symbol})</a>
                                </div>
                                <div className='text-2xl font-bold text-center max-w-lg'>
                                    {tokenAddress}
                                </div>

                                <Link href={`/token/${tokenAddress}`}>
                                    <button className='text-2xl font-bold text-center max-w-lg'>
                                        View Token
                                    </button>
                                </Link>

                                </div>
                        </div>
                    }
                    
                </div>
    </div>
</div>

                )
}

export default Create