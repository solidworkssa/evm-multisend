export const MULTISEND_ABI = [
    {
        "inputs": [],
        "name": "FailedCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientTokensReceived",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientValue",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "LengthMismatch",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NoRecipients",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RefundFailed",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TooManyRecipients",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TotalAmountMismatch",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroTotalAmount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalValue",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "recipientCount",
                "type": "uint256"
            }
        ],
        "name": "NativeSent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalValue",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "recipientCount",
                "type": "uint256"
            }
        ],
        "name": "TokenSent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address payable[]",
                "name": "recipients",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "name": "multiSendNative",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "recipients",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            }
        ],
        "name": "multiSendToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export const MULTISEND_ADDRESSES: Record<number, `0x${string}`> = {
    // Base Mainnet
    8453: '0xA574EC6E2B51B58eb339B7D5107598474BA14eC5',
    // Base Sepolia
    84532: '0x656bc95b9E2f713184129629C1c3dFbeB67aCc59',
};
