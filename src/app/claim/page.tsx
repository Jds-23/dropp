"use client"
import { AIRDROP_ADDRESS } from '@/constants/address'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, { use, useState } from 'react'
import { formatUnits, parseAbi } from 'viem'
import { useAccount, useChainId, useContractRead, useContractWrite, useToken } from 'wagmi'

const Claim = () => {
const chainId=useChainId()
const { address:userAddress, isConnected }=useAccount()
const [sessionId, setSessionId] = useState<string>('')

const {data:session}=useContractRead({
    address: AIRDROP_ADDRESS[chainId],
    abi: parseAbi(["function sessions(uint256 _sessionId) external view returns (string, uint256, uint256, uint256, address)"]),
    functionName: 'sessions',
    args: sessionId!=="" ? [BigInt(sessionId)] : undefined
})
const {data:claimedByUser}=useContractRead({
    address: AIRDROP_ADDRESS[chainId],
    abi: parseAbi(["function claimed(uint256 _sessionId, address _user) external view returns (uint256)"]),
    functionName: 'claimed',
    args:userAddress &&sessionId!=="" ? [BigInt(sessionId),userAddress] : undefined
})
const sessionName=session&&session[0]
const totalAmount=session&&session[1]
const maxClaimAmount=session&&session[2]
const claimedAirdrop=session&&session[3]
const tokenAddress=session&&session[4]
let leftToClaim,eligible,toClaim;
if(claimedAirdrop!==undefined&&totalAmount!==undefined)
leftToClaim=(totalAmount-claimedAirdrop)
if(leftToClaim!==undefined&&maxClaimAmount!==undefined)
eligible=(leftToClaim<maxClaimAmount?leftToClaim:maxClaimAmount)
if(eligible!==undefined&&claimedByUser!==undefined)
 toClaim=(eligible-claimedByUser)



const { data:tokenData } = useToken({
    address: tokenAddress,
  })
const {writeAsync:claim}=useContractWrite({
    address: AIRDROP_ADDRESS[chainId],
    abi: parseAbi(["function claimTokens(uint256 _sessionId,uint256 _claimAmount) external"]),
    functionName: 'claimTokens',
    args: toClaim&&sessionId!=="" ? [BigInt(sessionId),toClaim] : undefined
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
    <div className='mt-24'>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-4xl font-bold text-center max-w-lg'>
              Claim Airdrop
              </div>
                </div>
                <div className='text-2xl font-bold text-center max-w-lg'>
    <input
      value={sessionId}
      onChange={e => {
        // regex to only allow positive integers
        const regex = /^[0-9\b]+$/
        if (e.target.value === '' || regex.test(e.target.value)) {
        setSessionId(e.target.value)}
      }}
      className='border-2 border-solid outline-none mt-4 w-full p-2 rounded-lg text-black'
      placeholder='Enter Session Name'
    />
    {sessionName&&<div className='text-2xl font-bold text-center max-w-lg'>
        <div>

        {sessionName}
        </div>
        <>
        {toClaim&&tokenData&&<button
        className='text-2xl font-bold text-center max-w-lg bg-green-500 text-white rounded-lg p-2 mt-4'
        onClick={() => claim()}
        >
            Claim {formatUnits(toClaim,tokenData.decimals)} {tokenData.symbol} 
        </button>}
        </>
    </div>}

    </div>

    </div>

  )
}

export default Claim