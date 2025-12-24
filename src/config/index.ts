import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import {
    mainnet,
    arbitrum,
    optimism,
    polygon,
    base,
    bsc,
    avalanche,
    gnosis,
    celo,
    sepolia,
    arbitrumSepolia,
    optimismSepolia,
    baseSepolia,
    bscTestnet,
    avalancheFuji,
    celoAlfajores,
    bitcoin,
    bitcoinTestnet
} from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
    throw new Error('Project ID is not defined. Please set NEXT_PUBLIC_PROJECT_ID in your .env.local file');
}

// Define mainnet networks
export const mainnetNetworks: AppKitNetwork[] = [
    mainnet,
    arbitrum,
    optimism,
    polygon,
    base,
    bsc,
    avalanche,
    gnosis,
    celo,
    bitcoin,
];

// Define testnet networks
export const testnetNetworks: AppKitNetwork[] = [
    sepolia,
    arbitrumSepolia,
    optimismSepolia,
    baseSepolia,
    bscTestnet,
    avalancheFuji,
    celoAlfajores,
    bitcoinTestnet,
];

// All networks as tuple
export const allNetworks = [
    ...mainnetNetworks,
    ...testnetNetworks,
] as const;

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks: allNetworks as unknown as [AppKitNetwork, ...AppKitNetwork[]],
});

// Set up Bitcoin Adapter
export const bitcoinAdapter = new BitcoinAdapter({
    projectId,
});

export const config = wagmiAdapter.wagmiConfig;

// Network metadata for display
export interface NetworkMeta {
    id: number | string;
    name: string;
    symbol: string;
    isTestnet: boolean;
    blockExplorer?: string;
}

export const networkMeta: Record<string, NetworkMeta> = {
    // Mainnets- cast keys to string for consistent lookup
    '1': { id: 1, name: 'Ethereum', symbol: 'ETH', isTestnet: false, blockExplorer: 'https://etherscan.io' },
    '42161': { id: 42161, name: 'Arbitrum One', symbol: 'ETH', isTestnet: false, blockExplorer: 'https://arbiscan.io' },
    '10': { id: 10, name: 'Optimism', symbol: 'ETH', isTestnet: false, blockExplorer: 'https://optimistic.etherscan.io' },
    '137': { id: 137, name: 'Polygon', symbol: 'MATIC', isTestnet: false, blockExplorer: 'https://polygonscan.com' },
    '8453': { id: 8453, name: 'Base', symbol: 'ETH', isTestnet: false, blockExplorer: 'https://basescan.org' },
    '56': { id: 56, name: 'BNB Smart Chain', symbol: 'BNB', isTestnet: false, blockExplorer: 'https://bscscan.com' },
    '43114': { id: 43114, name: 'Avalanche', symbol: 'AVAX', isTestnet: false, blockExplorer: 'https://snowtrace.io' },
    '100': { id: 100, name: 'Gnosis', symbol: 'xDAI', isTestnet: false, blockExplorer: 'https://gnosisscan.io' },
    '42220': { id: 42220, name: 'Celo', symbol: 'CELO', isTestnet: false, blockExplorer: 'https://celoscan.io' },

    // Bitcoin
    // Reown uses different IDs based on the chain namespace. 
    // We add common variations to be safe.
    'bitcoin': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', isTestnet: false, blockExplorer: 'https://mempool.space' },
    'bip122:000000000019d6689c085ae165831e93': { id: 'bip122:000000000019d6689c085ae165831e93', name: 'Bitcoin', symbol: 'BTC', isTestnet: false, blockExplorer: 'https://mempool.space' },

    // Testnets
    '11155111': { id: 11155111, name: 'Sepolia', symbol: 'ETH', isTestnet: true, blockExplorer: 'https://sepolia.etherscan.io' },
    '421614': { id: 421614, name: 'Arbitrum Sepolia', symbol: 'ETH', isTestnet: true, blockExplorer: 'https://sepolia.arbiscan.io' },
    '11155420': { id: 11155420, name: 'Optimism Sepolia', symbol: 'ETH', isTestnet: true, blockExplorer: 'https://sepolia-optimism.etherscan.io' },
    '84532': { id: 84532, name: 'Base Sepolia', symbol: 'ETH', isTestnet: true, blockExplorer: 'https://sepolia.basescan.org' },
    '97': { id: 97, name: 'BSC Testnet', symbol: 'tBNB', isTestnet: true, blockExplorer: 'https://testnet.bscscan.com' },
    '43113': { id: 43113, name: 'Avalanche Fuji', symbol: 'AVAX', isTestnet: true, blockExplorer: 'https://testnet.snowtrace.io' },
    '44787': { id: 44787, name: 'Celo Alfajores', symbol: 'CELO', isTestnet: true, blockExplorer: 'https://alfajores.celoscan.io' },

    // Bitcoin Testnet
    'bitcoinTestnet': { id: 'bitcoinTestnet', name: 'Bitcoin Testnet', symbol: 'tBTC', isTestnet: true, blockExplorer: 'https://mempool.space/testnet' },
    'bip122:000000000933ea01ad0ee984209779ba': { id: 'bip122:000000000933ea01ad0ee984209779ba', name: 'Bitcoin Testnet', symbol: 'tBTC', isTestnet: true, blockExplorer: 'https://mempool.space/testnet' },
};
