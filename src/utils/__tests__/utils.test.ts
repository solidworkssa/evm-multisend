import { describe, it, expect } from 'vitest';
import {
    generateId,
    isValidAddress,
    isValidAmount,
    formatAddress,
    formatNumber,
    parseRecipients,
    createRecipient,
    validateRecipient,
    calculateTotalAmount,
    countValidRecipients,
    findDuplicateAddresses,
    formatBalance,
    getTxExplorerUrl,
    getAddressExplorerUrl,
} from '../index';

describe('Utils', () => {
    describe('generateId', () => {
        it('should generate a unique ID', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).toBeTruthy();
            expect(id2).toBeTruthy();
            expect(id1).not.toBe(id2);
        });

        it('should generate ID of correct length', () => {
            const id = generateId();
            expect(id.length).toBe(7);
        });
    });

    describe('isValidAddress', () => {
        it('should validate correct Ethereum addresses', () => {
            expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false); // Missing one char
            expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
            expect(isValidAddress('0xA574EC6E2B51B58eb339B7D5107598474BA14eC5')).toBe(true);
        });

        it('should reject invalid addresses', () => {
            expect(isValidAddress('')).toBe(false);
            expect(isValidAddress('0x')).toBe(false);
            expect(isValidAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(false); // Missing 0x
            expect(isValidAddress('0xZZZZ35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(false); // Invalid chars
            expect(isValidAddress('not an address')).toBe(false);
        });
    });

    describe('isValidAmount', () => {
        it('should validate correct amounts', () => {
            expect(isValidAmount('1')).toBe(true);
            expect(isValidAmount('0.5')).toBe(true);
            expect(isValidAmount('100.123456')).toBe(true);
            expect(isValidAmount('1000000')).toBe(true);
        });

        it('should reject invalid amounts', () => {
            expect(isValidAmount('')).toBe(false);
            expect(isValidAmount('0')).toBe(false);
            expect(isValidAmount('-1')).toBe(false);
            expect(isValidAmount('abc')).toBe(false);
            expect(isValidAmount('  ')).toBe(false);
        });
    });

    describe('formatAddress', () => {
        it('should format address with default chars', () => {
            const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
            const formatted = formatAddress(address);
            expect(formatted).toBe('0x742d35...f0bEb0');
        });

        it('should format address with custom chars', () => {
            const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
            const formatted = formatAddress(address, 4);
            expect(formatted).toBe('0x742d...bEb0');
        });

        it('should return original if address is too short', () => {
            const address = '0x1234';
            expect(formatAddress(address)).toBe(address);
        });

        it('should handle empty address', () => {
            expect(formatAddress('')).toBe('');
        });
    });

    describe('formatNumber', () => {
        it('should format numbers correctly', () => {
            expect(formatNumber(1234.5678)).toBe('1,234.5678');
            expect(formatNumber('1000')).toBe('1,000');
            expect(formatNumber(0.5)).toBe('0.5');
        });

        it('should handle very small numbers', () => {
            expect(formatNumber(0.00001)).toBe('< 0.0001');
            expect(formatNumber(0.000001)).toBe('< 0.0001');
        });

        it('should handle zero', () => {
            expect(formatNumber(0)).toBe('0');
            expect(formatNumber('0')).toBe('0');
        });

        it('should respect decimals parameter', () => {
            expect(formatNumber(1.123456, 2)).toBe('1.12');
            expect(formatNumber(1.123456, 6)).toBe('1.123456');
        });

        it('should handle invalid input', () => {
            expect(formatNumber('invalid')).toBe('0');
            expect(formatNumber(NaN)).toBe('0');
        });
    });

    describe('parseRecipients', () => {
        it('should parse comma-separated values', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1.5\n0xA574EC6E2B51B58eb339B7D5107598474BA14eC5,2.0';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(2);
            expect(recipients[0]).toEqual({ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount: '1.5' });
            expect(recipients[1]).toEqual({ address: '0xA574EC6E2B51B58eb339B7D5107598474BA14eC5', amount: '2.0' });
        });

        it('should parse space-separated values', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0 1.5';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(1);
            expect(recipients[0]).toEqual({ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount: '1.5' });
        });

        it('should parse semicolon-separated values', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0;1.5';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(1);
            expect(recipients[0]).toEqual({ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount: '1.5' });
        });

        it('should parse equals-separated values', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0=1.5';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(1);
            expect(recipients[0]).toEqual({ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount: '1.5' });
        });

        it('should handle addresses without amounts', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(1);
            expect(recipients[0]).toEqual({ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount: '' });
        });

        it('should skip empty lines', () => {
            const text = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1.5\n\n0xA574EC6E2B51B58eb339B7D5107598474BA14eC5,2.0';
            const recipients = parseRecipients(text);
            expect(recipients).toHaveLength(2);
        });
    });

    describe('createRecipient', () => {
        it('should create a valid recipient', () => {
            const recipient = createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5');
            expect(recipient.address).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0');
            expect(recipient.amount).toBe('1.5');
            expect(recipient.isValid).toBe(true);
            expect(recipient.id).toBeTruthy();
        });

        it('should create recipient with empty amount', () => {
            const recipient = createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '');
            expect(recipient.isValid).toBe(true); // Valid address, empty amount is allowed
        });

        it('should mark invalid recipient', () => {
            const recipient = createRecipient('invalid', '1.5');
            expect(recipient.isValid).toBe(false);
        });
    });

    describe('validateRecipient', () => {
        it('should validate correct recipient', () => {
            const recipient = createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5');
            expect(validateRecipient(recipient)).toBe(true);
        });

        it('should reject invalid address', () => {
            const recipient = createRecipient('invalid', '1.5');
            expect(validateRecipient(recipient)).toBe(false);
        });

        it('should reject invalid amount', () => {
            const recipient = createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '0');
            expect(validateRecipient(recipient)).toBe(false);
        });
    });

    describe('calculateTotalAmount', () => {
        it('should calculate total from recipients', () => {
            const recipients = [
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5'),
                createRecipient('0xA574EC6E2B51B58eb339B7D5107598474BA14eC5', '2.5'),
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', '3.0'),
            ];
            expect(calculateTotalAmount(recipients)).toBe('7');
        });

        it('should handle empty recipients', () => {
            expect(calculateTotalAmount([])).toBe('0');
        });

        it('should ignore invalid amounts', () => {
            const recipients = [
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5'),
                createRecipient('0xA574EC6E2B51B58eb339B7D5107598474BA14eC5', 'invalid'),
            ];
            expect(calculateTotalAmount(recipients)).toBe('1.5');
        });
    });

    describe('countValidRecipients', () => {
        it('should count valid recipients', () => {
            const recipients = [
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5'),
                createRecipient('invalid', '2.5'),
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', '3.0'),
            ];
            expect(countValidRecipients(recipients)).toBe(2);
        });
    });

    describe('findDuplicateAddresses', () => {
        it('should find duplicate addresses (case-insensitive)', () => {
            const recipients = [
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5'),
                createRecipient('0x742d35cc6634c0532925a3b844bc9e7595f0beb0', '2.5'), // Same address, different case
                createRecipient('0xA574EC6E2B51B58eb339B7D5107598474BA14eC5', '3.0'),
            ];
            const duplicates = findDuplicateAddresses(recipients);
            expect(duplicates).toHaveLength(1);
            expect(duplicates[0]).toBe('0x742d35cc6634c0532925a3b844bc9e7595f0beb0');
        });

        it('should return empty array if no duplicates', () => {
            const recipients = [
                createRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', '1.5'),
                createRecipient('0xA574EC6E2B51B58eb339B7D5107598474BA14eC5', '2.5'),
            ];
            expect(findDuplicateAddresses(recipients)).toHaveLength(0);
        });
    });

    describe('formatBalance', () => {
        it('should format balance with symbol', () => {
            expect(formatBalance('1234.5678', 'ETH')).toBe('1,234.5678 ETH');
            expect(formatBalance('0.5', 'BTC', 8)).toBe('0.5 BTC');
        });
    });

    describe('getTxExplorerUrl', () => {
        it('should generate transaction URL', () => {
            const hash = '0x1234567890abcdef';
            const url = getTxExplorerUrl(hash, 'https://etherscan.io');
            expect(url).toBe('https://etherscan.io/tx/0x1234567890abcdef');
        });

        it('should return empty string if no explorer URL', () => {
            expect(getTxExplorerUrl('0x123', undefined)).toBe('');
        });
    });

    describe('getAddressExplorerUrl', () => {
        it('should generate address URL', () => {
            const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
            const url = getAddressExplorerUrl(address, 'https://etherscan.io');
            expect(url).toBe('https://etherscan.io/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0');
        });

        it('should return empty string if no explorer URL', () => {
            expect(getAddressExplorerUrl('0x123', undefined)).toBe('');
        });
    });
});
