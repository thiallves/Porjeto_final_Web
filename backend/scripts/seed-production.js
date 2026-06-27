require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClientConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_URL.includes('sslmode=require') || process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1234',
    database: process.env.DB_NAME || 'barbearia_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}

async function main() {
  const client = new Client(getClientConfig());
  await client.connect();

  const adminPassword = await bcrypt.hash('123456', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  await client.query(`
    INSERT INTO "barbershops"
      ("id", "name", "address", "city", "neighborhood", "latitude", "longitude", "openingTime", "closingTime", "cancellationLimitHours", "dailyAppointmentLimit", "isActive", "createdAt", "updatedAt")
    VALUES
      (1, 'Barbearia Central', 'Rua A, 100', 'Rio de Janeiro', 'Centro', -22.9068, -43.1729, '08:00:00', '18:00:00', 2, 30, true, NOW(), NOW())
    ON CONFLICT ("id") DO NOTHING;
  `);

  await client.query(
    `
    INSERT INTO "users"
      ("id", "name", "email", "password", "phone", "role", "barbershopId", "isActive", "createdAt", "updatedAt")
    VALUES
      (1, 'Admin', 'admin@email.com', $1, '11999999999', 'ADMIN', NULL, true, NOW(), NOW()),
      (2, 'Barbeiro Teste', 'barbeiro@email.com', $2, '11988888888', 'BARBEIRO', 1, true, NOW(), NOW()),
      (3, 'Cliente Teste', 'cliente@email.com', $2, '11977777777', 'CLIENTE', NULL, true, NOW(), NOW())
    ON CONFLICT ("id") DO NOTHING;
  `,
    [adminPassword, userPassword],
  );

  await client.query(`
    INSERT INTO "services"
      ("id", "name", "price", "duration", "barbershopId", "isActive", "createdAt", "updatedAt")
    VALUES
      (1, 'CORTE_MAQUINA', 25.0, 20, 1, true, NOW(), NOW()),
      (2, 'CORTE_TESOURA', 35.0, 30, 1, true, NOW(), NOW()),
      (3, 'BARBA', 20.0, 15, 1, true, NOW(), NOW())
    ON CONFLICT ("id") DO NOTHING;
  `);

  await client.end();
  console.log('Seed de produção concluído. Login: admin@email.com / 123456');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
