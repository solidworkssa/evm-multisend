'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { parseRecipients, createRecipient, isValidAddress, isValidAmount } from '@/utils';
import type { Recipient } from '@/types';
import styles from './BulkImportModal.module.css';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (recipients: Recipient[]) => void;
}

export default function BulkImportModal({
    isOpen,
    onClose,
    onImport,
}: BulkImportModalProps) {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState<{ valid: number; invalid: number; total: number }>({
        valid: 0,
        invalid: 0,
        total: 0,
    });

    if (!isOpen) return null;

    const handleTextChange = (value: string) => {
        setText(value);

        const parsed = parseRecipients(value);
        const valid = parsed.filter(
            (r) => isValidAddress(r.address) && (r.amount === '' || isValidAmount(r.amount))
        ).length;

        setPreview({
            valid,
            invalid: parsed.length - valid,
            total: parsed.length,
        });
    };

    const handleImport = () => {
        const parsed = parseRecipients(text);
        const recipients = parsed.map((r) => createRecipient(r.address, r.amount));
        onImport(recipients);
        setText('');
        setPreview({ valid: 0, invalid: 0, total: 0 });
        onClose();
    };

    const handleClose = () => {
        setText('');
        setPreview({ valid: 0, invalid: 0, total: 0 });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Bulk Import Addresses</h3>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p className={styles.description}>
                        Paste your addresses with amounts. Each line should contain an address and an optional amount.
                    </p>

                    <div className={styles.formats}>
                        <p className={styles.formatsTitle}>Supported formats:</p>
                        <code className={styles.format}>address,amount</code>
                        <code className={styles.format}>address amount</code>
                        <code className={styles.format}>address;amount</code>
                        <code className={styles.format}>address=amount</code>
                    </div>

                    <div className={styles.example}>
                        <p className={styles.exampleTitle}>Example:</p>
                        <pre className={styles.exampleCode}>
                            {`0x1234567890123456789012345678901234567890,1.5
0xabcdefABCDEFabcdefABCDEFabcdefABCDEFabcd 2.0
0x9876543210987654321098765432109876543210;0.5`}
                        </pre>
                    </div>

                    <textarea
                        className={`textarea ${styles.textarea}`}
                        placeholder="Paste addresses here..."
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        rows={10}
                    />

                    {preview.total > 0 && (
                        <div className={styles.preview}>
                            <div className={styles.previewItem}>
                                <span>Total:</span>
                                <strong>{preview.total}</strong>
                            </div>
                            <div className={styles.previewItem}>
                                <span>Valid:</span>
                                <strong className={styles.validCount}>{preview.valid}</strong>
                            </div>
                            {preview.invalid > 0 && (
                                <div className={styles.previewItem}>
                                    <span>Invalid:</span>
                                    <strong className={styles.invalidCount}>{preview.invalid}</strong>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleImport}
                        disabled={preview.valid === 0}
                    >
                        Import {preview.valid > 0 ? `${preview.valid} Addresses` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}
