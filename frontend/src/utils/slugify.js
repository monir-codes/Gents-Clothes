/**
 * Generate clean SEO friendly slug from product name or fallback to ID
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // Supports English & Bengali characters
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProductUrl = (product) => {
  if (!product) return '/shop';
  const slug = product.slug || slugify(product.name) || product._id;
  return `/product/${slug}`;
};
