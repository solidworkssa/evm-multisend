# Performance Optimization Guide

## Overview

This guide covers performance optimization strategies for both the smart contract and frontend application.

---

## Smart Contract Optimization

### Gas Optimization Techniques

#### 1. Batch Size Optimization

The contract limits batches to 255 recipients to prevent out-of-gas errors:

```solidity
if (len > 255) revert TooManyRecipients();
```

**Gas Costs by Batch Size:**
- 1-10 recipients: ~50,000 - 200,000 gas
- 11-50 recipients: ~200,000 - 800,000 gas
- 51-100 recipients: ~800,000 - 1,500,000 gas
- 101-255 recipients: ~1,500,000 - 3,800,000 gas

**Recommendation:** For optimal gas efficiency, batch 20-50 recipients per transaction.

#### 2. Use Calldata Instead of Memory

```solidity
// ✅ Good - uses calldata (cheaper)
function multiSendNative(
    address payable[] calldata recipients,
    uint256[] calldata amounts
)

// ❌ Bad - uses memory (more expensive)
function multiSendNative(
    address payable[] memory recipients,
    uint256[] memory amounts
)
```

**Gas Savings:** ~3,000 gas per transaction

#### 3. Minimize Storage Operations

The contract is stateless - no storage variables:

```solidity
// ✅ Good - no storage
contract MultiSend is ReentrancyGuard {
    // Only events, no state variables
}

// ❌ Bad - uses storage
contract MultiSend {
    mapping(address => uint256) public balances; // Expensive!
}
```

**Gas Savings:** ~20,000 gas per SSTORE operation avoided

#### 4. Efficient Loop Operations

```solidity
// ✅ Good - cache length, use ++i
uint256 len = recipients.length;
for (uint256 i = 0; i < len; ++i) {
    recipients[i].sendValue(amounts[i]);
}

// ❌ Bad - recalculate length, use i++
for (uint256 i = 0; i < recipients.length; i++) {
    recipients[i].sendValue(amounts[i]);
}
```

**Gas Savings:** ~5 gas per iteration

#### 5. Custom Errors vs Require Strings

```solidity
// ✅ Good - custom errors (cheaper)
error LengthMismatch();
if (len != amounts.length) revert LengthMismatch();

// ❌ Bad - require with string (expensive)
require(len == amounts.length, "Length mismatch");
```

**Gas Savings:** ~50 gas per error

---

## Frontend Optimization

### 1. Code Splitting

Next.js automatically splits code, but you can optimize further:

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const BulkImportModal = dynamic(() => import('./BulkImportModal'), {
    loading: () => <div>Loading...</div>,
    ssr: false
});
```

**Benefits:**
- Smaller initial bundle
- Faster page load
- Better user experience

### 2. Memoization

Prevent unnecessary re-renders:

```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const totalAmount = useMemo(() => {
    return calculateTotalAmount(recipients);
}, [recipients]);

// Memoize callbacks
const handleAddRecipient = useCallback(() => {
    setRecipients([...recipients, newRecipient]);
}, [recipients]);
```

**Benefits:**
- Reduced CPU usage
- Smoother UI
- Better battery life on mobile

### 3. Debouncing Input Validation

```typescript
import { useEffect, useState } from 'react';

const [debouncedValue, setDebouncedValue] = useState(value);

useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
}, [value]);

// Validate only debounced value
useEffect(() => {
    validateInput(debouncedValue);
}, [debouncedValue]);
```

**Benefits:**
- Fewer validation calls
- Better performance
- Smoother typing experience

### 4. Optimize RPC Calls

```typescript
// ✅ Good - batch multiple calls
const [balance, tokenInfo] = await Promise.all([
    publicClient.getBalance({ address }),
    publicClient.readContract({ address: tokenAddress, abi, functionName: 'symbol' })
]);

// ❌ Bad - sequential calls
const balance = await publicClient.getBalance({ address });
const tokenInfo = await publicClient.readContract({ ... });
```

**Benefits:**
- Faster data loading
- Reduced latency
- Better UX

### 5. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
    src="/logo.png"
    alt="Logo"
    width={200}
    height={50}
    priority // For above-the-fold images
/>
```

**Benefits:**
- Automatic optimization
- Lazy loading
- WebP format
- Responsive images

---

## Network Performance

### 1. Choose Optimal RPC Endpoints

**Public RPC Issues:**
- Rate limiting
- Slower response times
- Potential downtime

**Solutions:**
- Use dedicated RPC providers (Alchemy, Infura, QuickNode)
- Implement fallback RPC endpoints
- Monitor RPC performance

```typescript
const rpcEndpoints = [
    'https://mainnet.base.org',
    'https://base-mainnet.g.alchemy.com/v2/YOUR-KEY',
    'https://base.llamarpc.com'
];

// Implement fallback logic
async function fetchWithFallback(endpoints) {
    for (const endpoint of endpoints) {
        try {
            return await fetch(endpoint);
        } catch (error) {
            continue;
        }
    }
    throw new Error('All endpoints failed');
}
```

### 2. Transaction Gas Optimization

```typescript
// Estimate gas with buffer
const estimatedGas = await publicClient.estimateGas({
    account,
    to: contractAddress,
    data: encodedData,
    value: totalValue
});

const gasLimit = estimatedGas * 120n / 100n; // 20% buffer

// Use EIP-1559 for better pricing
const { maxFeePerGas, maxPriorityFeePerGas } = await publicClient.estimateFeesPerGas();
```

**Benefits:**
- Avoid failed transactions
- Optimal gas pricing
- Faster confirmation

---

## Database & Caching

### 1. Local Storage Caching

```typescript
// Cache recent recipients
const CACHE_KEY = 'recent_recipients';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCachedRecipients() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
    }

    return data;
}
```

### 2. React Query Caching

```typescript
import { useQuery } from '@tanstack/react-query';

const { data: balance } = useQuery({
    queryKey: ['balance', address, chainId],
    queryFn: () => fetchBalance(address),
    staleTime: 10000, // 10 seconds
    cacheTime: 300000, // 5 minutes
});
```

**Benefits:**
- Reduced RPC calls
- Faster UI updates
- Better UX

---

## Performance Monitoring

### 1. Measure Gas Usage

```bash
# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Output example:
# ·-----------------------------------------|---------------------------|
# |  Solc version: 0.8.24                   ·  Optimizer enabled: true  │
# ··········································|···························│
# |  Methods                                                            │
# ·················|························|·············|·············│
# |  Contract      ·  Method                ·  Min        ·  Max        │
# ·················|························|·············|·············│
# |  MultiSend     ·  multiSendNative       ·  52,341     ·  3,821,456  │
# ·················|························|·············|·············│
# |  MultiSend     ·  multiSendToken        ·  78,234     ·  4,123,789  │
# ·················|························|·············|·············│
```

### 2. Frontend Performance Metrics

```typescript
// Measure component render time
import { Profiler } from 'react';

function onRenderCallback(
    id, // Component name
    phase, // "mount" or "update"
    actualDuration, // Time spent rendering
    baseDuration, // Estimated time without memoization
    startTime,
    commitTime
) {
    console.log(`${id} took ${actualDuration}ms to render`);
}

<Profiler id="MultiSendForm" onRender={onRenderCallback}>
    <MultiSendForm />
</Profiler>
```

### 3. Web Vitals

```typescript
// pages/_app.tsx
export function reportWebVitals(metric) {
    console.log(metric);
    // Send to analytics
}
```

**Key Metrics:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## Optimization Checklist

### Smart Contract
- [ ] Use `calldata` for function parameters
- [ ] Implement custom errors instead of require strings
- [ ] Minimize storage operations
- [ ] Optimize loop operations
- [ ] Set appropriate batch limits
- [ ] Use SafeERC20 for token transfers
- [ ] Enable Solidity optimizer

### Frontend
- [ ] Implement code splitting
- [ ] Use React.memo for expensive components
- [ ] Debounce input validation
- [ ] Optimize RPC calls
- [ ] Cache frequently accessed data
- [ ] Use Next.js Image component
- [ ] Implement lazy loading
- [ ] Monitor Web Vitals

### Network
- [ ] Use dedicated RPC endpoints
- [ ] Implement fallback RPC logic
- [ ] Optimize gas estimation
- [ ] Use EIP-1559 gas pricing
- [ ] Monitor network congestion

---

## Performance Benchmarks

### Target Metrics

**Smart Contract:**
- Gas per native transfer: < 25,000 gas
- Gas per token transfer: < 35,000 gas
- Maximum batch size: 255 recipients
- Average transaction time: 2-5 seconds

**Frontend:**
- Initial page load: < 2 seconds
- Time to interactive: < 3 seconds
- Component render time: < 16ms (60fps)
- RPC response time: < 500ms

---

## Troubleshooting Performance Issues

### High Gas Costs

**Problem:** Transactions using too much gas

**Solutions:**
1. Reduce batch size
2. Check for duplicate recipients
3. Verify network gas prices
4. Use gas estimation before sending

### Slow Page Load

**Problem:** Frontend takes too long to load

**Solutions:**
1. Check bundle size (`npm run build`)
2. Implement code splitting
3. Optimize images
4. Use CDN for static assets

### RPC Timeouts

**Problem:** RPC calls timing out

**Solutions:**
1. Switch to faster RPC endpoint
2. Implement retry logic
3. Use fallback endpoints
4. Reduce concurrent requests

---

## Additional Resources

- [Solidity Gas Optimization Tips](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Ethereum Gas Optimization](https://ethereum.org/en/developers/docs/gas/)
