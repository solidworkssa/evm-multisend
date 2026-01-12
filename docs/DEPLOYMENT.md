# Deployment Guide

## Prerequisites

Before deploying the MultiSend contract, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Hardhat** (installed via project dependencies)
4. **Wallet with funds** on the target network
5. **RPC endpoint** for the target network
6. **Block explorer API key** (for verification)

---

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Private key of the deployer wallet (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Block explorer API key for contract verification
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Custom RPC endpoints
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

**⚠️ Security Warning:**
- Never commit your `.env` file to version control
- Never share your private key
- Use a dedicated deployment wallet with minimal funds
- The `.env` file is already in `.gitignore`

### 3. Get API Keys

#### BaseScan API Key
1. Visit [BaseScan](https://basescan.org/)
2. Create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Add to `.env` file

---

## Network Configuration

The project is pre-configured for Base networks. To add more networks, edit `hardhat.config.js`:

```javascript
networks: {
  // Example: Add Ethereum Mainnet
  mainnet: {
    url: process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1,
  },
  // Example: Add Polygon
  polygon: {
    url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 137,
  },
}
```

---

## Deployment Steps

### 1. Compile Contracts

```bash
npx hardhat compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript types in `typechain-types/`
- Create artifacts in `artifacts/`

### 2. Run Tests (Recommended)

Before deploying to mainnet, run the test suite:

```bash
npx hardhat test
```

For detailed gas reporting:

```bash
REPORT_GAS=true npx hardhat test
```

For coverage report:

```bash
npx hardhat coverage
```

### 3. Deploy to Testnet

Deploy to Base Sepolia testnet first:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Expected Output:**
```
Deploying MultiSend contract...
MultiSend deployed to: 0x656bc95b9E2f713184129629C1c3dFbeB67aCc59
Waiting for 6 blocks verification...
Verifying contract...
Contract verified successfully
```

### 4. Verify Deployment

After deployment, verify the contract on the block explorer:

**Manual Verification:**
```bash
npx hardhat verify --network baseSepolia 0x656bc95b9E2f713184129629C1c3dFbeB67aCc59
```

**Check Contract on Explorer:**
1. Visit [Base Sepolia Explorer](https://sepolia.basescan.org/)
2. Search for your contract address
3. Verify the contract code is visible and verified

### 5. Test Contract Functionality

Test the deployed contract:

```bash
# Create a test script or use Hardhat console
npx hardhat console --network baseSepolia
```

Example test:
```javascript
const MultiSend = await ethers.getContractFactory("MultiSend");
const multiSend = await MultiSend.attach("0x656bc95b9E2f713184129629C1c3dFbeB67aCc59");

// Test with small amounts
const recipients = ["0xYourTestAddress1", "0xYourTestAddress2"];
const amounts = [ethers.parseEther("0.001"), ethers.parseEther("0.001")];
const tx = await multiSend.multiSendNative(recipients, amounts, {
  value: ethers.parseEther("0.002")
});
await tx.wait();
console.log("Test successful!");
```

### 6. Deploy to Mainnet

⚠️ **Only after thorough testing on testnet:**

```bash
npx hardhat run scripts/deploy.js --network base
```

**Pre-deployment Checklist:**
- [ ] Contract tested on testnet
- [ ] All tests passing
- [ ] Security audit completed (if applicable)
- [ ] Sufficient funds in deployer wallet
- [ ] Correct network selected
- [ ] Environment variables verified

---

## Post-Deployment

### 1. Update Frontend Configuration

Update `src/config/contracts.ts` with the new contract address:

```typescript
export const MULTISEND_ADDRESSES: Record<number, `0x${string}`> = {
  // Base Mainnet
  8453: '0xYourNewMainnetAddress',
  // Base Sepolia
  84532: '0xYourNewSepoliaAddress',
};
```

### 2. Document Deployment

Create a deployment record:

```markdown
## Deployment Record

**Network:** Base Mainnet
**Contract Address:** 0xYourAddress
**Deployer:** 0xYourDeployerAddress
**Block Number:** 12345678
**Transaction Hash:** 0xYourTxHash
**Date:** 2026-01-12
**Gas Used:** 1,234,567
**Deployment Cost:** 0.05 ETH
```

### 3. Verify Contract Source

Ensure the contract is verified on the block explorer so users can:
- Read the contract code
- Interact with the contract directly
- Verify the contract matches the source code

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Funds
```
Error: insufficient funds for gas * price + value
```
**Solution:** Add more ETH to your deployer wallet

#### 2. Nonce Too Low
```
Error: nonce has already been used
```
**Solution:** Wait for pending transactions or reset nonce

#### 3. Gas Estimation Failed
```
Error: cannot estimate gas
```
**Solution:** Check contract code for errors, ensure constructor parameters are correct

#### 4. Verification Failed
```
Error: Failed to verify contract
```
**Solution:** 
- Wait a few minutes and try again
- Ensure you're using the correct compiler version
- Check that constructor arguments match

#### 5. Network Connection Issues
```
Error: could not detect network
```
**Solution:**
- Check RPC endpoint is accessible
- Verify network configuration in `hardhat.config.js`
- Try alternative RPC endpoints

---

## Advanced Deployment

### Using Hardhat Ignition

For more complex deployment scenarios:

```bash
npx hardhat ignition deploy ./ignition/modules/MultiSend.ts --network base
```

### Deploying with Upgradeable Proxy

If you need upgradeability (requires contract modifications):

```bash
npm install @openzeppelin/hardhat-upgrades
```

Update deployment script:
```javascript
const { upgrades } = require("hardhat");

const MultiSend = await ethers.getContractFactory("MultiSend");
const multiSend = await upgrades.deployProxy(MultiSend, [], {
  initializer: false
});
```

### Multi-Network Deployment

Deploy to multiple networks in sequence:

```bash
# Deploy to all testnets
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy.js --network baseSepolia
npx hardhat run scripts/deploy.js --network optimismSepolia

# Deploy to all mainnets
npx hardhat run scripts/deploy.js --network mainnet
npx hardhat run scripts/deploy.js --network base
npx hardhat run scripts/deploy.js --network optimism
```

---

## Gas Optimization

### Estimate Deployment Cost

```bash
# Get gas report
REPORT_GAS=true npx hardhat test

# Check current gas prices
# Visit: https://basescan.org/gastracker
```

### Optimize Deployment

1. **Deploy during low gas periods**
2. **Use appropriate gas price**
3. **Consider EIP-1559 settings**

```javascript
// In deployment script
const tx = await MultiSend.deploy({
  maxFeePerGas: ethers.parseUnits("2", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("1", "gwei")
});
```

---

## Security Considerations

1. **Audit the contract** before mainnet deployment
2. **Use a hardware wallet** for mainnet deployments
3. **Test thoroughly** on testnet
4. **Verify contract source** on block explorer
5. **Monitor the contract** after deployment
6. **Have an incident response plan**

---

## Maintenance

### Monitoring

Set up monitoring for:
- Contract balance
- Transaction volume
- Failed transactions
- Gas usage patterns

### Updates

If you need to update the contract:
1. Deploy new version
2. Update frontend configuration
3. Communicate changes to users
4. Consider migration strategy for existing users

---

## Support

For deployment issues:
1. Check Hardhat documentation
2. Review network-specific documentation
3. Check block explorer for transaction details
4. Review error messages carefully
5. Consult the community or create an issue
