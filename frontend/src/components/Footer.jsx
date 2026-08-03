import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerSection}>
          <h2 className={styles.brand}>GentFits</h2>
          <p className={styles.description}>
            Redefining luxury men's fashion in Bangladesh. Premium fabrics, flawless tailoring, and timeless designs for the modern gentleman.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Shop</h3>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><Link to="/shop?category=New+Arrivals">New Arrivals</Link></li>
            <li className={styles.linkItem}><Link to="/shop?category=Premium">Premium Collection</Link></li>
            <li className={styles.linkItem}><Link to="/shop?category=Panjabis">Panjabis</Link></li>
            <li className={styles.linkItem}><Link to="/shop?category=Shirts">Shirts</Link></li>
            <li className={styles.linkItem}><Link to="/shop?category=Sale">Sale</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Support</h3>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><Link to="/faq">FAQ</Link></li>
            <li className={styles.linkItem}><Link to="/shipping">Shipping Policy</Link></li>
            <li className={styles.linkItem}><Link to="/returns">Return & Exchange</Link></li>
            <li className={styles.linkItem}><Link to="/size-guide">Size Guide</Link></li>
            <li className={styles.linkItem}><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Newsletter</h3>
          <p className={styles.description}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} required />
            <button type="submit" className={styles.newsletterBtn}><Mail size={18} /></button>
          </form>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <p>&copy; {new Date().getFullYear()} GentFits. All Rights Reserved.</p>
          <div className={styles.paymentIcons}>
            <span>VISA</span>
            <span>MasterCard</span>
            <span>bKash</span>
            <span>Nagad</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
