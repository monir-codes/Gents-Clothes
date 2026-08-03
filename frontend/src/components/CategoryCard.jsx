import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ title, image, link }) => {
  return (
    <motion.div 
      className={styles.card}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={link}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.linkText}>Shop Now &rarr;</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
