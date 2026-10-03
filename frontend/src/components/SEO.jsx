import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type = 'website', name = 'রঙবতী', canonical, schemaMarkup }) => {
  const defaultKeywords = "রঙবতী, Ronggoboti, ronggoboti bd, buy saree online bd, premium womens clothing bd, best saree brand in bangladesh, salwar kameez online, stylish kurti collection, womens fashion bangladesh, exclusive lehenga dhaka, ladies boutique bd, online shopping for women in bangladesh, মেয়েদের পোশাক, শাড়ি কালেকশন, সালোয়ার কামিজ, কুর্তি ডিজাইন, women's clothing store dhaka, top clothing brands for women in bd";
  
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
