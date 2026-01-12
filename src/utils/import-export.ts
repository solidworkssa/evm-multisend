import type { Recipient } from '@/types';

/**
 * Export recipients to CSV format
 */
export function exportToCSV(recipients: Recipient[]): string {
    const header = 'Address,Amount\n';
    const rows = recipients
        .map((r) => `${r.address},${r.amount}`)
        .join('\n');
    return header + rows;
}

/**
 * Export recipients to JSON format
 */
export function exportToJSON(recipients: Recipient[]): string {
    const data = recipients.map((r) => ({
        address: r.address,
        amount: r.amount,
    }));
    return JSON.stringify(data, null, 2);
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export recipients as CSV file
 */
export function exportRecipientsAsCSV(recipients: Recipient[], filename = 'recipients.csv'): void {
    const csv = exportToCSV(recipients);
    downloadFile(csv, filename, 'text/csv');
}

/**
 * Export recipients as JSON file
 */
export function exportRecipientsAsJSON(recipients: Recipient[], filename = 'recipients.json'): void {
    const json = exportToJSON(recipients);
    downloadFile(json, filename, 'application/json');
}

/**
 * Import recipients from CSV text
 */
export function importFromCSV(csvText: string): Recipient[] {
    const lines = csvText.trim().split('\n');
    const recipients: Recipient[] = [];

    // Skip header if present
    const startIndex = lines[0]?.toLowerCase().includes('address') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [address, amount] = line.split(',').map((s) => s.trim());
        if (address && amount) {
            recipients.push({
                id: Math.random().toString(36).substring(2, 9),
                address,
                amount,
                isValid: true,
            });
        }
    }

    return recipients;
}

/**
 * Import recipients from JSON text
 */
export function importFromJSON(jsonText: string): Recipient[] {
    try {
        const data = JSON.parse(jsonText);
        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array');
        }

        return data.map((item) => ({
            id: Math.random().toString(36).substring(2, 9),
            address: item.address || '',
            amount: item.amount || '',
            isValid: true,
        }));
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
    }
}
