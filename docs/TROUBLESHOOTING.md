# Troubleshooting Guide

## Common Issues and Solutions

This guide covers common issues you might encounter while using or developing EVM MultiSend.

---

## Smart Contract Issues

### Issue: Transaction Fails with "LengthMismatch"

**Symptom:** Transaction reverts with `LengthMismatch()` error

**Cause:** The recipients array and amounts array have different lengths

**Solution:**
```javascript
// ✅ Correct - same length
const recipients = ['0xAddr1', '0xAddr2'];
const amounts = [ethers.parseEther('1'), ethers.parseEther('2')];

// ❌ Wrong - different lengths
const recipients = ['0xAddr1', '0xAddr2'];
const amounts = [ethers.parseEther('1')]; // Missing one amount!
```

---

### Issue: Transaction Fails with "InsufficientValue"

**Symptom:** Native token transfer fails

**Cause:** `msg.value` sent is less than the sum of all amounts

**Solution:**
```javascript
// Calculate total correctly
const total = amounts.reduce((sum, amt) => sum + amt, 0n);

// Send exact or more value
await multiSend.multiSendNative(recipients, amounts, { 
    value: total // Or slightly more - excess will be refunded
});
```

---

### Issue: Transaction Fails with "TooManyRecipients"

**Symptom:** Transaction reverts when sending to many addresses

**Cause:** More than 255 recipients in a single transaction

**Solution:**
```javascript
// Split into multiple batches
const BATCH_SIZE = 200;
for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batchRecipients = recipients.slice(i, i + BATCH_SIZE);
    const batchAmounts = amounts.slice(i, i + BATCH_SIZE);
    await multiSend.multiSendNative(batchRecipients, batchAmounts, { value: total });
}
```

---

### Issue: ERC20 Transfer Fails

**Symptom:** `multiSendToken` transaction fails

**Possible Causes & Solutions:**

1. **Insufficient Allowance**
```javascript
// Check and approve first
const allowance = await token.allowance(userAddress, multiSendAddress);
if (allowance < totalAmount) {
    await token.approve(multiSendAddress, totalAmount);
    // Wait for approval confirmation
    await approvalTx.wait();
}
```

2. **Insufficient Token Balance**
```javascript
// Check balance before sending
const balance = await token.balanceOf(userAddress);
if (balance < totalAmount) {
    console.error('Insufficient token balance');
    return;
}
```

3. **Fee-on-Transfer Token**
```javascript
// The contract handles this, but ensure you're sending enough
// Some tokens take a fee on transfer, so actual received < sent
```

---

## Frontend Issues

### Issue: Wallet Not Connecting

**Symptom:** Wallet connection button doesn't work

**Possible Causes & Solutions:**

1. **Missing Project ID**
```bash
# Check .env.local file
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
```

2. **Browser Extension Not Installed**
- Install MetaMask, Coinbase Wallet, or other supported wallet
- Refresh the page after installation

3. **Wrong Network**
```javascript
// Check if network is supported
const supportedChainIds = [1, 8453, 84532, /* ... */];
if (!supportedChainIds.includes(chainId)) {
    // Prompt user to switch network
}
```

---

### Issue: "Network Mismatch" Error

**Symptom:** Transaction fails due to wrong network

**Solution:**
```javascript
// Request network switch
await walletClient.switchChain({ id: 8453 }); // Base Mainnet
```

Or manually in wallet:
1. Open wallet extension
2. Click network dropdown
3. Select correct network (e.g., Base Mainnet)

---

### Issue: Gas Estimation Failed

**Symptom:** Cannot estimate gas for transaction

**Possible Causes & Solutions:**

1. **Invalid Recipient Address**
```javascript
// Validate all addresses
recipients.forEach(addr => {
    if (!isValidAddress(addr)) {
        console.error(`Invalid address: ${addr}`);
    }
});
```

2. **Insufficient Balance**
```javascript
// Check balance includes gas
const balance = await publicClient.getBalance({ address });
const totalNeeded = totalAmount + estimatedGas * gasPrice;
if (balance < totalNeeded) {
    console.error('Insufficient balance for transaction + gas');
}
```

3. **Contract Would Revert**
```javascript
// Transaction simulation failed
// Check all inputs are valid
// Verify contract address is correct
```

---

### Issue: Transaction Pending Forever

**Symptom:** Transaction stuck in pending state

**Possible Causes & Solutions:**

1. **Low Gas Price**
```javascript
// Use current network gas price
const { maxFeePerGas } = await publicClient.estimateFeesPerGas();
// Add priority fee for faster confirmation
const maxPriorityFeePerGas = parseGwei('2');
```

2. **Network Congestion**
- Wait for network to clear
- Or speed up transaction in wallet
- Or cancel and resend with higher gas

3. **Nonce Issues**
```javascript
// Check pending transactions
const pendingTxs = await publicClient.getPendingTransactions();
// May need to wait or cancel previous transaction
```

---

### Issue: Page Won't Load

**Symptom:** White screen or loading forever

**Solutions:**

1. **Clear Browser Cache**
```bash
# Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
# Select "Cached images and files"
```

2. **Check Console for Errors**
```bash
# Open browser console: F12 or Cmd+Option+I
# Look for error messages
```

3. **Verify Environment Variables**
```bash
# Check .env.local exists and has correct values
cat .env.local
```

4. **Rebuild Application**
```bash
rm -rf .next
npm run build
npm run dev
```

---

## Development Issues

### Issue: Contract Compilation Fails

**Symptom:** `npx hardhat compile` fails

**Solutions:**

1. **Check Solidity Version**
```javascript
// hardhat.config.js
solidity: {
    version: "0.8.24", // Must match contract pragma
}
```

2. **Clear Cache**
```bash
npx hardhat clean
rm -rf cache artifacts
npx hardhat compile
```

3. **Check Dependencies**
```bash
npm install @openzeppelin/contracts@^5.4.0
```

---

### Issue: Tests Failing

**Symptom:** `npm run test` shows failures

**Solutions:**

1. **Compile First**
```bash
npx hardhat compile
npx hardhat test
```

2. **Check Network**
```bash
# Tests run on Hardhat network by default
# Ensure no conflicts with other local nodes
```

3. **Reset Hardhat Network**
```bash
npx hardhat clean
npx hardhat test --network hardhat
```

---

### Issue: Deployment Fails

**Symptom:** Contract deployment transaction fails

**Solutions:**

1. **Check Private Key**
```bash
# Verify PRIVATE_KEY in .env (without 0x prefix)
# Ensure deployer has sufficient funds
```

2. **Verify Network Configuration**
```javascript
// hardhat.config.js
networks: {
    baseSepolia: {
        url: "https://sepolia.base.org",
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        chainId: 84532,
    }
}
```

3. **Check Gas Settings**
```bash
# Network may require specific gas settings
# Check network documentation
```

---

### Issue: Contract Verification Fails

**Symptom:** `npx hardhat verify` fails

**Solutions:**

1. **Wait for Confirmations**
```bash
# Wait at least 6 block confirmations before verifying
# Check on block explorer
```

2. **Check API Key**
```bash
# Verify BASESCAN_API_KEY in .env
# Ensure API key is valid
```

3. **Manual Verification**
```bash
# Try manual verification on block explorer
# Upload flattened contract source
npx hardhat flatten contracts/MultiSend.sol > flattened.sol
```

---

## Performance Issues

### Issue: High Gas Costs

**Symptom:** Transactions cost more gas than expected

**Solutions:**

1. **Reduce Batch Size**
```javascript
// Smaller batches = less gas per transaction
const OPTIMAL_BATCH = 50; // Adjust based on network
```

2. **Wait for Lower Gas Prices**
```bash
# Check gas prices: https://basescan.org/gastracker
# Send during off-peak hours
```

3. **Optimize Recipient List**
```javascript
// Remove duplicates
// Validate all addresses before sending
```

---

### Issue: Slow Transaction Confirmation

**Symptom:** Transactions take long to confirm

**Solutions:**

1. **Increase Gas Price**
```javascript
const { maxFeePerGas } = await publicClient.estimateFeesPerGas();
const increasedFee = maxFeePerGas * 120n / 100n; // 20% higher
```

2. **Check Network Status**
```bash
# Visit network status page
# Base: https://status.base.org
```

---

## Error Messages Reference

### Contract Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| `LengthMismatch()` | Array lengths don't match | Ensure recipients and amounts arrays are same length |
| `NoRecipients()` | Empty recipient array | Add at least one recipient |
| `TooManyRecipients()` | More than 255 recipients | Split into smaller batches |
| `InvalidRecipient()` | Zero address in recipients | Remove invalid addresses |
| `InsufficientValue()` | Not enough ETH sent | Send total amount or more |
| `RefundFailed()` | Refund transaction failed | Check recipient can receive ETH |
| `ZeroTotalAmount()` | Total amount is zero | Specify valid total amount |
| `TotalAmountMismatch()` | Calculated total ≠ provided | Recalculate total amount |
| `InsufficientTokensReceived()` | Fee-on-transfer token | Account for transfer fees |

### Frontend Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| `User rejected` | User declined in wallet | Try again, user must approve |
| `Insufficient funds` | Not enough balance | Add funds to wallet |
| `Network error` | RPC connection issue | Check internet, try different RPC |
| `Invalid address` | Malformed address | Verify address format (0x...) |
| `Gas estimation failed` | Transaction would fail | Check all inputs are valid |

---

## Getting Help

If you're still experiencing issues:

1. **Check Documentation**
   - [README.md](../README.md)
   - [API Documentation](./API.md)
   - [Deployment Guide](./DEPLOYMENT.md)

2. **Search Existing Issues**
   - [GitHub Issues](https://github.com/[owner]/evm-multisend/issues)

3. **Create New Issue**
   - Provide error messages
   - Include steps to reproduce
   - Share relevant code snippets
   - Specify network and environment

4. **Community Support**
   - Discord/Telegram (if available)
   - Stack Overflow with tag `evm-multisend`

---

## Debug Mode

Enable debug logging:

```javascript
// In your .env.local
DEBUG=true
NODE_ENV=development

// In code
if (process.env.DEBUG) {
    console.log('Debug info:', { recipients, amounts, total });
}
```

---

**Last Updated:** 2026-01-12
