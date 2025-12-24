'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import {
    NetworkSelector,
    TokenSelector,
    RecipientList,
    BulkImportModal,
    TransactionSummary,
} from '@/components';
import type { Recipient, Token, TransactionStatus } from '@/types';
import { createRecipient, validateRecipient, findDuplicateAddresses } from '@/utils';
import styles from './MultiSendForm.module.css';

export default function MultiSendForm() {
    const [recipients, setRecipients] = useState<Recipient[]>([createRecipient()]);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
    const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle' });

    const { isConnected, address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    // Transaction hooks
    const { sendTransactionAsync } = useSendTransaction();
    const { writeContractAsync } = useWriteContract();

    // Recipient management
    const handleAddRecipient = useCallback(() => {
        setRecipients((prev) => [...prev, createRecipient()]);
    }, []);

    const handleRemoveRecipient = useCallback((id: string) => {
        setRecipients((prev) => prev.filter((r) => r.id !== id));
    }, []);

    const handleUpdateRecipient = useCallback(
        (id: string, field: 'address' | 'amount', value: string) => {
            setRecipients((prev) =>
                prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
            );
        },
        []
    );

    const handleBulkImport = useCallback((importedRecipients: Recipient[]) => {
        setRecipients(importedRecipients);
    }, []);

    const handleClearAll = useCallback(() => {
        setRecipients([createRecipient()]);
        setTxStatus({ status: 'idle' });
    }, []);

    // Send transaction
    const handleSend = async () => {
        if (!isConnected || !address || !selectedToken) {
            return;
        }

        // Check for Bitcoin network
        if (String(chainId).includes('bitcoin') || String(chainId).startsWith('bip122')) {
            setTxStatus({
                status: 'error',
                error: 'Bitcoin sending logic is architected but not fully implemented in this UI. See AUDIT_REPORT.md.',
            });
            return;
        }

        const validRecipients = recipients.filter(validateRecipient);
        if (validRecipients.length === 0) {
            setTxStatus({ status: 'error', error: 'No valid recipients' });
            return;
        }

        // Check for duplicates
        const duplicates = findDuplicateAddresses(validRecipients);
        if (duplicates.length > 0) {
            setTxStatus({
                status: 'error',
                error: `Duplicate addresses found: ${duplicates.length}`,
            });
            return;
        }

        setTxStatus({ status: 'preparing' });

        try {
            if (selectedToken.isNative) {
                // Send native token (ETH, etc.) - batch transactions
                // For simplicity, we'll send individually (in production, use a multisend contract)
                for (const recipient of validRecipients) {
                    setTxStatus({ status: 'pending' });
                    const hash = await sendTransactionAsync({
                        to: recipient.address as `0x${string}`,
                        value: parseEther(recipient.amount),
                    });
                    setTxStatus({ status: 'success', hash });
                }
            } else {
                // For ERC20 tokens, would need approval + multisend contract
                // This is a simplified version
                setTxStatus({
                    status: 'error',
                    error: 'ERC20 batch transfers require a MultiSend contract. Native token only for demo.',
                });
                return;
            }
        } catch (error) {
            console.error('Transaction error:', error);
            setTxStatus({
                status: 'error',
                error: error instanceof Error ? error.message : 'Transaction failed',
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                {/* Network Selection */}
                <section className={styles.section}>
                    <NetworkSelector />
                </section>

                {/* Token Selection */}
                <section className={styles.section}>
                    <TokenSelector
                        selectedToken={selectedToken}
                        onSelectToken={setSelectedToken}
                    />
                </section>

                {/* Recipients */}
                <section className={styles.section}>
                    <div className={styles.recipientHeader}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsBulkImportOpen(true)}
                        >
                            <Upload size={16} />
                            Bulk Import
                        </button>

                        {recipients.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <RecipientList
                        recipients={recipients}
                        onUpdateRecipient={handleUpdateRecipient}
                        onRemoveRecipient={handleRemoveRecipient}
                        onAddRecipient={handleAddRecipient}
                        tokenSymbol={selectedToken?.symbol || 'TOKEN'}
                    />
                </section>
            </div>

            {/* Sidebar - Transaction Summary */}
            <aside className={styles.sidebar}>
                <TransactionSummary
                    recipients={recipients}
                    token={selectedToken}
                    chainId={chainId}
                    txStatus={txStatus}
                    onSend={handleSend}
                />
            </aside>

            {/* Bulk Import Modal */}
            <BulkImportModal
                isOpen={isBulkImportOpen}
                onClose={() => setIsBulkImportOpen(false)}
                onImport={handleBulkImport}
            />
        </div>
    );
}
