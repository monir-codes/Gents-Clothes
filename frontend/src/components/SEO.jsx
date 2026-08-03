import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, type = 'website', name = 'GentFits' }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${name}` : name}</title>
      <meta name='description' content={description} />
      
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
