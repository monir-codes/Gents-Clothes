import React from 'react';
import { motion } from 'framer-motion';

const BlogPreview = () => {
  const articles = [
    { title: "How to Style a Linen Shirt", date: "Aug 12, 2026", img: "https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=600" },
    { title: "The Ultimate Guide to Men's Accessories", date: "Jul 28, 2026", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600" },
    { title: "Choosing the Right Panjabi for Eid", date: "Jun 15, 2026", img: "https://images.unsplash.com/photo-1601056637651-789a74a161ed?auto=format&fit=crop&q=80&w=600" }
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
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
