import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_KEYWORDS = "রঙবতী, Ronggoboti, ronggoboti bd, rongoboti, ronggoboti fashion, ronggoboti clothing, রঙবতী ফ্যাশন, buy saree online bd, premium womens clothing bd, best saree brand in bangladesh, salwar kameez online, stylish kurti collection, womens fashion bangladesh, exclusive lehenga dhaka, ladies boutique bd, online shopping for women in bangladesh, মেয়েদের পোশাক, শাড়ি কালেকশন, সালোয়ার কামিজ, কুর্তি ডিজাইন, থ্রি পিস, কাতান শাড়ি, জামদানি শাড়ি, সুতি শাড়ি, সিল্ক শাড়ি, ঈদ কালেকশন, eid dress collection bd, modest wear abaya bd, bridal lehenga bangladesh, party wear for women bd, designer kurtis bd, three piece collection bangladesh";

const DEFAULT_DESCRIPTION = "রঙবতী (Ronggoboti) - বাংলাদেশের শীর্ষস্থানীয় এক্সক্লুসিভ উইমেন ফ্যাশন ব্র্যান্ড। প্রিমিয়াম শাড়ি (Sarees), সালোয়ার কামিজ (Salwar Kameez), ডিজাইনার কুর্তি (Kurtis), লেহেঙ্গা ও মডেস্ট ওয়েয়ার অনলাইন কিনুন সেরা মূল্যে। Fast delivery across Bangladesh.";

const BASE_URL = 'https://ronggoboti.vercel.app';
const DEFAULT_IMAGE = 'https://ronggoboti.vercel.app/images/hero-banner.jpg';

const SEO = ({ 
  title, 
  description = DEFAULT_DESCRIPTION, 
  keywords = DEFAULT_KEYWORDS, 
  type = 'website', 
  name = 'রঙবতী | Ronggoboti', 
  canonical, 
  image = DEFAULT_IMAGE,
  schemaMarkup,
  noIndex = false
}) => {
  const pageTitle = title ? `${title} | ${name}` : `${name} - Exclusive Women's Fashion & Designer Collection in Bangladesh`;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="রঙবতী (Ronggoboti)" />
      <meta name="publisher" content="রঙবতী" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="language" content="Bengali, English" />
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Dhaka, Bangladesh" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="রঙবতী | Ronggoboti" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="রঙবতী - Premium Women's Fashion" />
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@ronggoboti" />
      <meta name="twitter:site" content="@ronggoboti" />

      {/* Structured Data (Schema Markup) */}
      {schemaMarkup && (
        Array.isArray(schemaMarkup) ? (
          schemaMarkup.map((schema, idx) => (
            <script key={idx} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(schemaMarkup)}
          </script>
        )
      )}
    </Helmet>
  );
};

export default SEO;
