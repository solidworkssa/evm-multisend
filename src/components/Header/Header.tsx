'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="EVM MultiSend"
                        width={40}
                        height={40}
                        priority
                    />
                    <span className={styles.logoText}>MultiSend</span>
                </Link>

                <div className={styles.actions}>
                    <appkit-button />
                </div>
            </div>
        </header>
    );
}
