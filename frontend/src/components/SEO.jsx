import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type = 'website', name = 'Gents Clothes' }) => {
  const defaultKeywords = "Gents Clothes, luxury menswear Bangladesh, premium men's clothing BD, buy panjabi online Dhaka, stylish shirts for men, premium t-shirts BD, men's fashion Bangladesh, exclusive menswear, designer panjabi collection, men's clothing store, fashionable menswear, cash on delivery mens clothing BD, online shopping BD home delivery, best menswear brand in Dhaka, gents fashion BD, eid panjabi collection, casual shirts for men, formal shirts men Dhaka, quality t-shirts online, mens clothing online shopping bangladesh cash on delivery";
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${name}` : name}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords || defaultKeywords} />
      
      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title ? `${title} | ${name}` : name} />
      <meta property='og:description' content={description} />
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title ? `${title} | ${name}` : name} />
      <meta name='twitter:description' content={description} />
    </Helmet>
  );
};

export default SEO;
