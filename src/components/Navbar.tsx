'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setOpenDropdown(openDropdown === name ? null : name);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Image
            src="/assets/images/logo.jpg"
            alt="Ramadan Giving"
            width={50}
            height={50}
            className="logo-img"
          />
          <span className="logo-text">Ramadan Giving</span>
        </Link>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-dropdown">
            <a 
              href="#about" 
              className={`dropdown-trigger ${openDropdown === 'about' ? 'open' : ''}`}
              onClick={(e) => toggleDropdown('about', e)}
            >
              About
              <svg className="dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>
            <div className={`dropdown-menu ${openDropdown === 'about' ? 'show' : ''}`}>
              <div className="dropdown-section">
                <span className="dropdown-label">About Us</span>
                <Link href="/#about" onClick={closeMobileMenu}>Our Mission</Link>
                <Link href="/#team" onClick={closeMobileMenu}>Our Team</Link>
                <Link href="/#impact" onClick={closeMobileMenu}>Our Impact</Link>
              </div>
            </div>
          </li>
          
          <li className="nav-dropdown">
            <a 
              href="#" 
              className={`dropdown-trigger ${openDropdown === 'programs' ? 'open' : ''}`}
              onClick={(e) => toggleDropdown('programs', e)}
            >
              Programs
              <svg className="dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>
            <div className={`dropdown-menu dropdown-menu-wide ${openDropdown === 'programs' ? 'show' : ''}`}>
              <div className="dropdown-section">
                <span className="dropdown-label">GTA Programs</span>
                <Link href="/#impact" onClick={closeMobileMenu}>Food Distribution</Link>
                <Link href="/#impact" onClick={closeMobileMenu}>Winter Kits</Link>
                <Link href="/#impact" onClick={closeMobileMenu}>Children&apos;s Camp</Link>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-label">Cairo Programs</span>
                <Link href="/#impact" onClick={closeMobileMenu}>Food Packages</Link>
                <Link href="/#impact" onClick={closeMobileMenu}>Orphan Support</Link>
                <Link href="/#impact" onClick={closeMobileMenu}>Gaza Relief</Link>
              </div>
            </div>
          </li>
          
          <li className="nav-dropdown">
            <a 
              href="#" 
              className={`dropdown-trigger ${openDropdown === 'resources' ? 'open' : ''}`}
              onClick={(e) => toggleDropdown('resources', e)}
            >
              Resources
              <svg className="dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>
            <div className={`dropdown-menu dropdown-menu-wide ${openDropdown === 'resources' ? 'show' : ''}`}>
              <div className="dropdown-section">
                <span className="dropdown-label">Resources</span>
                <Link href="/blog" onClick={closeMobileMenu}>Blog & News</Link>
                <Link href="/#gallery" onClick={closeMobileMenu}>Photo Gallery</Link>
                <Link href="/#locations" onClick={closeMobileMenu}>Our Locations</Link>
              </div>
              <div className="dropdown-section">
                <span className="dropdown-label">Community</span>
                <a href="https://www.instagram.com/ramadan.giving/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <Link href="/#get-involved" onClick={closeMobileMenu}>Volunteer</Link>
                <Link href="/#get-involved" onClick={closeMobileMenu}>Partner With Us</Link>
              </div>
            </div>
          </li>
          
          <li>
            <Link href="/#get-involved" onClick={closeMobileMenu}>Get Involved</Link>
          </li>
          <li>
            <Link href="/donate" className="btn-primary nav-donate-btn" onClick={closeMobileMenu}>
              Donate
            </Link>
          </li>
        </ul>
        
        <div 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

