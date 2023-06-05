import { isAddress, parseAbi } from "viem";
import { PublicClient } from "wagmi";
import { getContract } from 'wagmi/actions'


async function isERC20(client: PublicClient, contractAddress: string, chainId: number, address: undefined | `0x${string}`): Promise<undefined | [string, string, number, string, string] | [string, string, number, string]> {
    if (!isAddress(contractAddress)) return undefined;
    // The minimum set of functions needed to be considered as an ERC20 Token
    const fragment = [
        'function name() external view returns (string)',
        'function symbol() external view returns (string)',
        'function decimals() external view returns (uint8)',
        'function totalSupply() external view returns (uint256)',
        'function balanceOf(address account) external view returns (uint256)',
        'function transfer(address recipient, uint256 amount) external returns (bool)',
        'function allowance(address owner, address spender) external view returns (uint256)',
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'event Approval(address indexed owner, address indexed spender, uint256 value)'
    ];

    const iface = parseAbi(fragment);
    const contract = getContract({
        address: `0x${contractAddress.replace(/^0x/, '')}`,
        abi: iface,
        walletClient: client,
        chainId
    })

    try {
        if (!address) {
            // @ts-ignore
            return await Promise.all([
                contract.read.name(),
                contract.read.symbol(),
                contract.read.decimals(),
                contract.read.totalSupply(),
            ]);
        } else
            // @ts-ignore
            return await Promise.all([
                contract.read.name(),
                contract.read.symbol(),
                contract.read.decimals(),
                contract.read.totalSupply(),
                contract.read.balanceOf([address]),
            ]);
    } catch {
        return undefined;
    }
}

// provider should be a JsonRpcProvider or InfuraProvider or AlchemyProvider
// and contractAddress is the address of the token contract to check
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
// const isErc20 = await isERC20(provider, '0xYourContractAddress');
// console.log(`Is ERC20: ${isErc20}`);

export default isERC20;