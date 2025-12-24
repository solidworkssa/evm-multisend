'use client';

import { wagmiAdapter, bitcoinAdapter, projectId, allNetworks } from '@/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
    throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
    name: 'EVM MultiSend',
    description: 'Send tokens to multiple addresses in one transaction across all EVM networks',
    url: 'https://evm-multisend.vercel.app',
    icons: ['/logo.png'],
};

// Create the modal
createAppKit({
    adapters: [wagmiAdapter, bitcoinAdapter],
    projectId,
    networks: allNetworks as unknown as [AppKitNetwork, ...AppKitNetwork[]],
    defaultNetwork: mainnet,
    metadata: metadata,
    themeMode: 'light',
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'github', 'discord', 'farcaster'],
    },
    themeVariables: {
        '--w3m-color-mix': '#000000',
        '--w3m-color-mix-strength': 10,
        '--w3m-accent': '#000000',
        '--w3m-border-radius-master': '2px',
    },
});

function ContextProvider({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies: string | null;
}) {
    const initialState = cookieToInitialState(
        wagmiAdapter.wagmiConfig as Config,
        cookies
    );

    return (
        <WagmiProvider
            config={wagmiAdapter.wagmiConfig as Config}
            initialState={initialState}
        >
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;
