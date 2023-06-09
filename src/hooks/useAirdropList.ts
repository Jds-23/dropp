import { useChainId } from "wagmi";
import useLocalStorage from "./useLocalStorage";


export default function useAirdropLists(): [string[] | undefined, (airdropId: string) => void] {
    const chainId = useChainId()
    const [airdropList, setAirdropList] = useLocalStorage<{ [chainId in number]: string[] }>("airdropList", {})
    return [airdropList[chainId], (airdropId: string) => setAirdropList(airdropList[chainId] ? { ...airdropList, [chainId]: [airdropId, ...airdropList[chainId]] } : { ...airdropList, [chainId]: [airdropId] })]
}