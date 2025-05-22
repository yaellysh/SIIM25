import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
    return (
        <nav style={styles.nav}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link href="/">
                        <a style={styles.navLink}>Home</a>
                    </Link>
                </li>
                <li style={styles.navItem}>
                    <Link href="/about">
                        <a style={styles.navLink}>About</a>
                    </Link>
                </li>
                <li style={styles.navItem}>
                    <Link href="/contact">
                        <a style={styles.navLink}>Contact</a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#333',
        padding: '10px 20px',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
    },
    navItem: {
        marginRight: '20px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
    },
};

export default NavBar;