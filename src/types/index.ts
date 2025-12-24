// Type definitions for EVM MultiSend

export interface Recipient {
    id: string;
    address: string;
    amount: string;
    isValid: boolean;
}

export interface Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    balance?: string;
    isNative: boolean;
}

export interface NetworkInfo {
    id: number;
    name: string;
    symbol: string;
    isTestnet: boolean;
    blockExplorer?: string;
}

export interface TransactionStatus {
    status: 'idle' | 'preparing' | 'pending' | 'success' | 'error';
    hash?: string;
    error?: string;
}

export interface ParsedRecipient {
    address: string;
    amount: string;
}

// ERC20 ABI for token interactions
export const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
] as const;

// MultiSend contract ABI (simplified for demo - in production use actual deployed contract)
export const MULTISEND_ABI = [
    {
        inputs: [
            { name: 'recipients', type: 'address[]' },
            { name: 'amounts', type: 'uint256[]' },
        ],
        name: 'multiSendETH',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'token', type: 'address' },
            { name: 'recipients', type: 'address[]' },
            { name: 'amounts', type: 'uint256[]' },
        ],
        name: 'multiSendToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
