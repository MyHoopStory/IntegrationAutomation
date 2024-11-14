'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/shared.module.css';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        <nav className={`nav nav-pills flex-column flex-sm-row p-2 mb-5 ${styles.nav}`}>
          <Link 
            href="/" 
            className={`flex-sm-fill text-sm-center nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/create-project" 
            className={`flex-sm-fill text-sm-center nav-link ${pathname === '/create-project' ? 'active' : ''}`}
          >
            Create Project
          </Link>
          <Link 
            href="/projects" 
            className={`flex-sm-fill text-sm-center nav-link ${pathname === '/projects' ? 'active' : ''}`}
          >
            Projects
          </Link>
          <Link 
            href="#" 
            className="flex-sm-fill text-sm-center nav-link disabled"
            data-bs-toggle="tooltip" 
            data-bs-placement="bottom" 
            data-bs-title="Coming Soon!"
          >
            Warehouse Tracking
          </Link>
          <Link 
            href="#" 
            className="flex-sm-fill text-sm-center nav-link disabled"
            data-bs-toggle="tooltip" 
            data-bs-placement="bottom" 
            data-bs-title="Coming Soon!"
          >
            Automation Hub
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation; 