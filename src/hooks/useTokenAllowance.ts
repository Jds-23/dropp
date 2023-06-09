import { useState } from "react"
import { formatUnits, parseAbi } from "viem"
import { useChainId, useContractRead, useContractWrite, usePublicClient, useTransaction } from "wagmi"
import { FetchTokenResult } from "wagmi/dist/actions"

export enum TokenApprovalState {
    NOT_APPROVED,
    APPROVED,
    APPROVING
}

export default function useTokenAllowance(token: FetchTokenResult | undefined, spender: `0x${string}`, amount: bigint, owner: undefined | `0x${string}`) {
    const chainId = useChainId()
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
    const client = usePublicClient()

    const { data: allowance, refetch } = useContractRead({
        // contractAddress: tokenAddress,
        address: token?.address,
        abi: parseAbi([
            'function allowance(address owner, address spender) external view returns (uint256)']),
        functionName: 'allowance',
        args: owner && [owner, spender]
    })
    const { writeAsync: approve } = useContractWrite({
        address: token?.address,
        abi: parseAbi(['function approve(address spender, uint256 amount) external returns (bool)']),
        functionName: 'approve',
        args: [spender, amount],
        onSuccess: (result) => {
            const txHash = result.hash
            if (txHash) {
                client.waitForTransactionReceipt({ hash: txHash }).then((receipt) => {
                    refetch()
                })
            }
        }
    })
    // @ts-ignore
    return allowance != undefined ? {
        allowance: amount > allowance ? TokenApprovalState.NOT_APPROVED : TokenApprovalState.APPROVED, approve: async () => {
            approve().then((res) => {
                setHash(res.hash)
            }
            )
        }, allowanceValue: allowance
    } : {
        allowance: TokenApprovalState.NOT_APPROVED,
        approve: undefined,
        allowanceValue: undefined
    }
}
