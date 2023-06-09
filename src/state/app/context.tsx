"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

import { Chain } from 'viem'

export const scroll_alpha_testnet = {
  id: 53_4353,
  name: 'Scroll Alpha Testnet',
  network: 'scroll_testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://alpha-rpc.scroll.io/l2'] },
    default: { http: ['https://alpha-rpc.scroll.io/l2'] },
  },
  blockExplorers: {
    etherscan: { name: 'BlockScout', url: 'https://blockscout.scroll.io' },
    default: { name: 'BlockScout', url: 'https://blockscout.scroll.io' },
  },
  contracts: {
  },
} as const satisfies Chain


const { chains, publicClient } = configureChains(
    [ polygon, scroll_alpha_testnet],
    [
      alchemyProvider({ apiKey: "aDKJq_J0-enA7NOA3ln8Ra7eujzxWx70" }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'fb0efb64b8910b28a54d3f0567ab31db',
    chains
  });
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  const AppProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    return (
      <QueryProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
      </QueryProvider>
    );
  };

  export default AppProvider;