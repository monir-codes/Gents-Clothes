import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import axios from 'axios';
import styles from './Footer.module.css';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#', instagram: '#', tiktok: '#', youtube: '#'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data.socialLinks) {
          setSocialLinks(data.socialLinks);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerSection}>
          <h2 className={styles.brand}>GentFits</h2>
          <p className={styles.description}>
            Redefining luxury men's fashion in Bangladesh. Premium fabrics, flawless tailoring, and timeless designs for the modern gentleman.
          </p>
          <div className={styles.socialLinks}>
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4h3.5c.3 2.1 1.7 3.5 3.5 3.5h1v3.5h-1a6 6 0 0 1-5-1.7V16a7.5 7.5 0 1 1-6-7.3v3.7A4 4 0 0 0 9 12z"></path></svg>
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            )}
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
        <div className={`container ${styles.bottomBarInner}`}>
          <p>&copy; {new Date().getFullYear()} GentFits. All Rights Reserved.</p>
          <div className={styles.paymentIcons}>
            <span>VISA</span>
            <span>MasterCard</span>
            <span>bKash</span>
            <span>Nagad</span>
          </div>
          <div className={styles.legalLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
