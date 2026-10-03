import React from 'react';
import { motion } from 'framer-motion';

const BlogPreview = () => {
  const articles = [
    { title: "The Art of Draping Jamdani & Muslin Sarees", date: "Oct 02, 2026", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600" },
    { title: "Styling Contemporary Kurtis & Co-ord Sets", date: "Sep 25, 2026", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600" },
    { title: "Festive Trends: Salwar Kameez & Silk Edit", date: "Sep 18, 2026", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600" }
  ];

  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 600, textTransform: 'uppercase' }}>The Journal</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Style guides and editorial features.</p>
        </motion.div>
        <button style={{ background: 'transparent', border: 'none', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', color: 'var(--color-text-primary)' }}>View All</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
        {articles.map((article, i) => (
          <motion.article 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ cursor: 'pointer' }}
            whileHover={{ y: -5 }}
          >
            <div style={{ width: '100%', height: '240px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }}>
              <img src={article.img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{article.date}</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '8px' }}>{article.title}</h3>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
