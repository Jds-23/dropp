import { parseAbi } from "viem";

const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "sessionName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "claimer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_sessionName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_claimAmount",
                "type": "uint256"
            }
        ],
        "name": "claimTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_sessionName",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxClaimAmount",
                "type": "uint256"
            }
        ],
        "name": "createSession",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "sessionName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "maxClaimAmount",
                "type": "uint256"
            }
        ],
        "name": "SessionCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "claimed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "sessions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxClaimAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimedAmount",
                "type": "uint256"
            },
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const

const DeFiVault = parseAbi(["function claimTokens(string _sessionName, uint256 _claimAmount) external payable",
    "function createSession(string _sessionName, address _token, uint256 _totalAmount, uint256 _maxClaimAmount) external returns ()",
    "function sessions(string) view returns (uint256, uint256, uint256, address)",
    "function claimed(string, address) view returns (uint256)"])