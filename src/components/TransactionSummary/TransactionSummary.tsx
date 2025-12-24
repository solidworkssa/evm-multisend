'use client';

import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import type { Recipient, Token, TransactionStatus } from '@/types';
import { formatNumber, calculateTotalAmount, countValidRecipients, getTxExplorerUrl } from '@/utils';
import { networkMeta } from '@/config';
import styles from './TransactionSummary.module.css';

interface TransactionSummaryProps {
    recipients: Recipient[];
    token: Token | null;
    chainId: number | string | undefined;
    txStatus: TransactionStatus;
    onSend: () => void;
}

export default function TransactionSummary({
    recipients,
    token,
    chainId,
    txStatus,
    onSend,
}: TransactionSummaryProps) {
    const validRecipients = countValidRecipients(recipients);
    const totalAmount = calculateTotalAmount(recipients.filter(r => r.address && r.amount));
    const networkInfo = chainId ? networkMeta[String(chainId)] : null;

    const isReady = validRecipients > 0 && token !== null;
    const isPending = txStatus.status === 'pending' || txStatus.status === 'preparing';

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Transaction Summary</h3>

            <div className={styles.summary}>
                <div className={styles.row}>
                    <span className={styles.label}>Network</span>
                    <span className={styles.value}>{networkInfo?.name || 'Not Connected'}</span>
                </div>

                <div className={styles.row}>
                    <span className={styles.label}>Token</span>
                    <span className={styles.value}>{token?.symbol || 'Not Selected'}</span>
                </div>

                <div className={styles.row}>
                    <span className={styles.label}>Recipients</span>
                    <span className={styles.value}>{validRecipients}</span>
                </div>

                <div className={styles.row}>
                    <span className={styles.label}>Total Amount</span>
                    <span className={`${styles.value} ${styles.totalAmount}`}>
                        {formatNumber(totalAmount)} {token?.symbol || ''}
                    </span>
                </div>

                {token && token.balance && (
                    <div className={styles.row}>
                        <span className={styles.label}>Your Balance</span>
                        <span className={styles.value}>
                            {formatNumber(token.balance)} {token.symbol}
                        </span>
                    </div>
                )}
            </div>

            {/* Transaction Status */}
            {txStatus.status !== 'idle' && (
                <div className={`${styles.status} ${styles[txStatus.status]}`}>
                    {txStatus.status === 'preparing' && (
                        <>
                            <Loader2 className={styles.statusIcon} size={20} />
                            <span>Preparing transaction...</span>
                        </>
                    )}
                    {txStatus.status === 'pending' && (
                        <>
                            <Loader2 className={styles.statusIcon} size={20} />
                            <span>Transaction pending...</span>
                        </>
                    )}
                    {txStatus.status === 'success' && (
                        <>
                            <CheckCircle className={styles.statusIcon} size={20} />
                            <span>Transaction successful!</span>
                            {txStatus.hash && networkInfo?.blockExplorer && (
                                <a
                                    href={getTxExplorerUrl(txStatus.hash, networkInfo.blockExplorer)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.txLink}
                                >
                                    View on Explorer
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </>
                    )}
                    {txStatus.status === 'error' && (
                        <>
                            <XCircle className={styles.statusIcon} size={20} />
                            <span>{txStatus.error || 'Transaction failed'}</span>
                        </>
                    )}
                </div>
            )}

            {/* Warnings */}
            {token && token.balance && parseFloat(totalAmount) > parseFloat(token.balance) && (
                <div className={styles.warning}>
                    Insufficient balance. You need {formatNumber(totalAmount)} {token.symbol} but only have{' '}
                    {formatNumber(token.balance)} {token.symbol}.
                </div>
            )}

            <button
                type="button"
                className={`btn btn-primary btn-lg ${styles.sendBtn}`}
                onClick={onSend}
                disabled={!isReady || isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className={styles.spinner} size={18} />
                        Processing...
                    </>
                ) : (
                    `Send to ${validRecipients} Address${validRecipients !== 1 ? 'es' : ''}`
                )}
            </button>
        </div>
    );
}
