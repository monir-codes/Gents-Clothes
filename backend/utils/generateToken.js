const DEFAULT_JWT_SECRET = '183cc74500bd70b70d06bd0504da3bb4e7dc85085596b04fbb3cbcad6ce239b1d478efa3648081e3438783fbe9868e4360c93f47b127089373fbe00799250bf5';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
