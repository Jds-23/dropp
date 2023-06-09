"use client"
import { AIRDROP_ADDRESS } from '@/constants/address'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { c } from '@wagmi/cli/dist/config-c09a23a5'
import React, { use, useState } from 'react'
import { formatUnits, parseAbi } from 'viem'
import { useAccount, useChainId, useContractRead, useContractWrite, useToken } from 'wagmi'

enum TransactionState {
  NOT_STARTED,
  CLAIMING,
  DONE,
}


const Claim = ({params}:{params:{id:string}}) => {
  const sessionName=params.id
const chainId=useChainId()
const { address:userAddress, isConnected }=useAccount()
const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.NOT_STARTED)


const {data:session,refetch:sessionRefetch}=useContractRead({
    address: AIRDROP_ADDRESS[chainId],
    abi: parseAbi(["function sessions(string calldata _sessionName) external view returns (string, uint256, uint256, uint256, address)"]),
    functionName: 'sessions',
    args: sessionName!=="" ? [sessionName] : undefined
})
const {data:claimedByUser,refetch:claimedByUserRefetch}=useContractRead({
    address: AIRDROP_ADDRESS[chainId],
    abi: parseAbi(["function claimed(string calldata _sessionName, address _user) external view returns (uint256)"]),
    functionName: 'claimed',
    args:userAddress &&sessionName!=="" ? [sessionName,userAddress] : undefined
})
// const sessionName=session&&session[0]
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
    abi: parseAbi(["function claimTokens(string calldata _sessionName,uint256 _claimAmount) external"]),
    functionName: 'claimTokens',
    args: toClaim&&sessionName!=="" ? [sessionName,toClaim] : undefined,
    onSuccess: () => {
      console.log('success')
      setTransactionState(TransactionState.CLAIMING)
    },
    onSettled: () => {  
      console.log('settled')
      setTransactionState(TransactionState.DONE)
      sessionRefetch()
      claimedByUserRefetch()
    },
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
    {sessionName&&<div className='text-2xl font-bold text-center max-w-lg'>
        <div>

        {sessionName}
        </div>
        {tokenData&&totalAmount!==undefined&&<div>
          Airdrop Balance: {formatUnits(totalAmount,tokenData.decimals)} {tokenData.symbol}
          </div>}
        <>
        {toClaim&&tokenData&&<button
        className='text-2xl font-bold text-center max-w-lg bg-green-500 text-white rounded-lg p-2 mt-4'
        onClick={() => claim()}
        >
                      {
            transactionState === TransactionState.CLAIMING
              ? 'Claiming...'
              : transactionState === TransactionState.DONE
                ? 'Claimed!'
                : `Claim ${formatUnits(toClaim,tokenData.decimals)} ${tokenData.symbol}`
                      }

        </button>}
        </>
    </div>}

    </div>

    </div>

  )
}

export default Claim