import { useChainId } from "wagmi";
import useLocalStorage from "./useLocalStorage";


export default function useTokenLists(): [string[] | undefined, (airdropId: `0x${string}`) => void] {
    const chainId = useChainId()
    const [tokenList, setTokenList] = useLocalStorage<{ [chainId in number]: `0x${string}`[] }>("tokenList", {})
    return [tokenList[chainId], (tokenAddress: `0x${string}`) => setTokenList(tokenList[chainId] ? { ...tokenList, [chainId]: [tokenAddress, ...tokenList[chainId]] } : { ...tokenList, [chainId]: [tokenAddress] })]
    // return tokenList[chainId]
}