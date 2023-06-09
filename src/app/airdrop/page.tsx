"use client"
import React, {  useState } from 'react'
import { isAddress, parseAbi, parseUnits } from 'viem'
import { useAccount, useBalance, useChainId, useContractWrite, usePublicClient, useToken, useTransaction, useWaitForTransaction, useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useTokenAllowance, { TokenApprovalState } from '@/hooks/useTokenAllowance'
import { AIRDROP_ADDRESS } from '@/constants/address'
import Link from 'next/link'
import useAirdropLists from '@/hooks/useAirdropList';
import { useSearchParams } from 'next/navigation';

enum TransactionState {
  NOT_STARTED,
  CREATING_SESSION,
  DONE,
}

const Page = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('token')

const [tokenAddress, setTokenAddress] = useState(search?search:'')
const [totalAirdrop, setTotalAirdrop] = useState<string>('')
const [sessionName, setSessionName] = useState<string>('')
const [maxClaimable, setMaxClaimable] = useState<string>('')

const [airdropList,setAirdropList]=useAirdropLists()


const chainId=useChainId()
const { address:userAddress, isConnected }=useAccount()
// const [sessionId, setSessionId] = useState<string>()


const { data:tokenData } = useToken({
  address: isAddress(tokenAddress)?`0x${tokenAddress.replace(/^0x/, '')}`:undefined,
})
const { data:tokenBalanceData } = useBalance({
  token: tokenData?.address,
  address:tokenData&& userAddress&&`0x${userAddress.replace(/^0x/, '')}`,
})

const {approve,allowanceValue,allowance}=useTokenAllowance(tokenData,AIRDROP_ADDRESS[chainId],tokenBalanceData?.value??BigInt(0),userAddress)
  // convert totalAirdrop to wei using parseUnits from viem library
  const totalAirdropNumber = parseFloat(totalAirdrop)
  const totalAirdropWei =tokenData&& parseUnits(`${Number.isNaN(totalAirdropNumber)?0:totalAirdropNumber}`, tokenData.decimals )
  const moreThanBalance=tokenBalanceData&&totalAirdropWei!==undefined&&tokenBalanceData.value<totalAirdropWei
  // convert maxClaimable to wei using parseUnits from viem library
  const maxClaimableNumber = parseFloat(maxClaimable)
  const maxClaimableWei =tokenData&& parseUnits(`${Number.isNaN(maxClaimableNumber)?0:maxClaimableNumber}`, tokenData.decimals )

  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.NOT_STARTED)

const client=usePublicClient()
const { writeAsync: createSession2 } = useContractWrite({
        address: AIRDROP_ADDRESS[chainId],
        abi: parseAbi(["function createSession(string _sessionName, address _token, uint256 _totalAmount, uint256 _maxClaimAmount) external"]),
        functionName: 'createSession',
        args: tokenData && sessionName ? [sessionName, tokenData.address, totalAirdropWei ?? BigInt(0), maxClaimableWei ?? BigInt(0)] : undefined,
        onSettled: (receipt) => {
            const hash=(receipt?.hash)
            if(hash)
            client.waitForTransactionReceipt({hash}).then(receipt=>{
              console.log(receipt)
              setAirdropList(sessionName)
            setTransactionState(TransactionState.DONE)})
        },
        onSuccess: (result) => {
          setTransactionState(TransactionState.CREATING_SESSION)
        }
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

  return (
    <>
        <div className='mt-24'>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-4xl font-bold text-center max-w-lg'>
              Airdrop
              </div>
              <input value={tokenAddress} onChange={e=>{
                setTokenAddress(e.target.value)
                setTransactionState(TransactionState.NOT_STARTED)
                }} className={`${tokenData?"border-green-500":"border-red-500"} border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black`} placeholder='Enter Token Address' />
{
  tokenData&&<div><div className='text-2xl font-bold text-center max-w-lg'>
  {tokenData.name} ({tokenData.symbol})
  </div>


  {tokenBalanceData&&<>
  <div className='text-2xl font-bold text-center max-w-lg'>
    Your Balance:
  </div>
  <div className='text-2xl font-bold text-center max-w-lg'>
  {tokenBalanceData.formatted} {tokenBalanceData.symbol}
  </div>
  <div className='text-2xl font-bold text-center max-w-lg'>
    <input
      value={sessionName}
      onChange={e => {setSessionName(e.target.value)
        setTransactionState(TransactionState.NOT_STARTED)
      }}
      className='border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black'
      placeholder='Enter Session Name'
    />
    <input value={totalAirdrop} onChange={e=>{
      // regex to only allow decimal numbers
      if (e.target.value.match(/^\d*\.?\d*$/)) {
                setTotalAirdrop(e.target.value)
                                setTransactionState(TransactionState.NOT_STARTED)

      }
                }} className='border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black' placeholder='Enter Total Airdrop Amount' />
                <input value={maxClaimable} onChange={e=>{
                        // regex to only allow decimal numbers
      if (e.target.value.match(/^\d*\.?\d*$/)) {
                setMaxClaimable(e.target.value)
                                setTransactionState(TransactionState.NOT_STARTED)

      }
                }} className='border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black' placeholder='Enter Max Claimable Amount' />
  </div>
  <button onClick={async()=>{
    if(approve)
    await approve()
    }} className={`${tokenBalanceData.value<=(allowanceValue??BigInt(0))?"hidden":""}  text-2xl font-bold text-center max-w-lg bg-green-500 text-white rounded-lg p-2 mt-4`}>
    Approve
  </button>
  {
    allowance===TokenApprovalState.APPROVED&&<button onClick={async()=>{
       createSession2().then((res) => {
        console.log(res)
        // setHash(res.hash)
      })
      }
      } className={`${moreThanBalance?"hidden":""} text-2xl font-bold text-center max-w-lg bg-green-500 text-white rounded-lg p-2 mt-4`}>
        {
          transactionState===TransactionState.CREATING_SESSION&&<div className='flex items-center justify-center'>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }
        {
          transactionState===TransactionState.NOT_STARTED&&"Create Session"
        }
        {
          transactionState===TransactionState.DONE&&"Session Created"
        }
    </button>
  }
  {
   transactionState===TransactionState.DONE&& <div className='text-2xl font-bold text-center max-w-lg'>
    Claim Link: <Link href={`claim/${sessionName}`}  className='text-blue-500'>Link</Link>

  </div>
  }

  </>}
  </div>
}

              </div>
        </div>
</>
  )
}

export default Page