require('dotenv').config();

function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) return null;

  const url = new URL(databaseUrl);
  return {
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace('/', ''),
    host: url.hostname,
    port: Number(url.port || 5432),
    dialect: 'postgres',
    dialectOptions:
      url.searchParams.get('sslmode') === 'require' || process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  };
}

const databaseUrlConfig = parseDatabaseUrl(process.env.DATABASE_URL);

const defaultConfig = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1234',
  database: process.env.DB_NAME || 'barbearia_db',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  dialectOptions:
    process.env.DB_SSL === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
};

module.exports = {
  development: defaultConfig,
  test: {
    ...defaultConfig,
    database: process.env.DB_NAME_TEST || 'barbearia_test',
  },
  production: databaseUrlConfig || defaultConfig,
};
