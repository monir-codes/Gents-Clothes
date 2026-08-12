import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type = 'website', name = 'Gents Clothes', canonical, schemaMarkup }) => {
  const defaultKeywords = "Gents Clothes, gents clothes bd, gents clothes bangladesh, buy panjabi online dhaka, premium mens clothing bd, best panjabi brand in bangladesh, panjabi for men, stylish panjabi collection, mens fashion bangladesh, premium t-shirts bd, buy casual shirts online bd, mens polo shirts bd, formal shirts for men dhaka, eid panjabi collection 2024, best menswear brand in dhaka, gents fashion bd, buy mens clothes online bangladesh cash on delivery, mens lifestyle clothing, luxury menswear bangladesh, exclusive panjabi dhaka, online shopping for men in bangladesh, ছেলেদের পোশাক, পাঞ্জাবি ডিজাইন, ছেলেদের শার্ট, ছেলেদের টিশার্ট, men's clothing store dhaka, top clothing brands for men in bd";
  
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

      {/* Canonical URL */}
      {canonical && <link rel='canonical' href={canonical} />}

      {/* Structured Data (Schema Markup) */}
      {schemaMarkup && (
        <script type='application/ld+json'>
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
