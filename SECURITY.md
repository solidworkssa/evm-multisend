# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 0.1.x   | :white_check_mark: | Active Development |
| < 0.1   | :x:                | Not Supported |

## Reporting a Vulnerability

**⚠️ Do not report security vulnerabilities through public GitHub issues.**

We take the security of EVM MultiSend seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

Please report security vulnerabilities by:

1. **Email:** Send details to the repository maintainers (check GitHub profile for contact)
2. **GitHub Security Advisory:** Use the [GitHub Security Advisory](https://github.com/[owner]/evm-multisend/security/advisories/new) feature
3. **Private Disclosure:** Contact the maintainers directly through GitHub

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., reentrancy, overflow, access control)
- **Full paths of affected source files**
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions to reproduce** the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact assessment** (what an attacker could achieve)
- **Suggested fix** (if you have one)

### Response Timeline

- **Initial Response:** Within 48 hours of report
- **Status Update:** Within 7 days with severity assessment
- **Fix Timeline:** Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- We will acknowledge your report and work with you to understand the issue
- We will keep you informed of our progress
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We request that you do not publicly disclose the issue until we have released a fix

## Security Best Practices

### For Users

1. **Verify Contract Addresses:** Always verify you're interacting with the official contract
2. **Check Transaction Details:** Review all transaction details before signing
3. **Use Hardware Wallets:** For large amounts, use hardware wallets
4. **Test on Testnet:** Test your transactions on testnet first
5. **Keep Software Updated:** Use the latest version of the application

### For Developers

1. **Code Review:** All code changes require review
2. **Testing:** Maintain >90% test coverage
3. **Audits:** Regular security audits for smart contracts
4. **Dependencies:** Keep dependencies updated
5. **Access Control:** Limit access to deployment keys

## Known Security Considerations

### Smart Contract

- **Reentrancy Protection:** Contract uses OpenZeppelin's ReentrancyGuard
- **Integer Overflow:** Solidity 0.8.24 has built-in overflow protection
- **Access Control:** No admin functions - fully permissionless
- **Gas Limits:** Maximum 255 recipients per transaction
- **Fee-on-Transfer Tokens:** Contract checks actual received amounts

### Frontend

- **Input Validation:** All inputs are validated client-side and contract-side
- **XSS Protection:** Next.js provides built-in XSS protection
- **CSRF Protection:** Not applicable for Web3 dApps
- **Dependency Security:** Regular dependency audits via npm audit

## Security Audits

| Date | Auditor | Scope | Report |
|------|---------|-------|--------|
| TBD  | TBD     | Smart Contract | Not yet audited |

**Note:** This project has not yet undergone a professional security audit. Use at your own risk.

## Bug Bounty Program

We currently do not have a formal bug bounty program. However, we appreciate responsible disclosure and will:

- Acknowledge your contribution
- Credit you in our security advisories
- Consider rewards for critical vulnerabilities (at our discretion)

## Security Updates

Security updates will be:
- Released as soon as possible after verification
- Announced in GitHub Security Advisories
- Documented in the CHANGELOG
- Communicated to users through appropriate channels

## Contact

For security concerns, please contact the repository maintainers through:
- GitHub Security Advisories (preferred)
- Direct message to repository owner
- Email (check maintainer's GitHub profile)

---

**Last Updated:** 2026-01-12
