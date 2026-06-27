# API Barbearia - Backend NestJS

API de agendamento para barbearias usando NestJS, Sequelize, PostgreSQL, JWT e Swagger.

## Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente
- Banco criado com o nome definido em `.env` (`barbearia_db` por padrão)

## Instalação

```bash
npm install
cp .env.example .env
```

Ajuste o arquivo `.env` conforme seu PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=1234
DB_NAME=barbearia_db
JWT_SECRET=segredoJWT
PORT=3000
```

## Banco de dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE barbearia_db;
```

Execute migrations e seeds:

```bash
npm run db:migrate
npm run db:seed
```

Para resetar tudo:

```bash
npm run db:reset
```

## Rodar API

```bash
npm run start:dev
```

Swagger:

```txt
http://localhost:3000/api
```

## Usuários seedados

Todos usam a senha `123456`.

- Admin: `admin@email.com`
- Barbeiro: `barbeiro@email.com`
- Cliente: `cliente@email.com`

## Correções principais desta versão

- Configuração de banco saiu do hardcoded e passou a usar `.env`.
- `synchronize` foi desativado para respeitar migrations.
- Migrations foram refeitas em JavaScript compatível com `sequelize-cli`.
- Seeds foram refeitos com senha criptografada via bcrypt.
- Foi adicionado filtro global de tratamento de erros HTTP.
- Foi criada camada de repositório para usuários, barbearias, serviços e agendamentos.
- Modelos foram padronizados com `tableName`, `timestamps`, chaves primárias e relacionamentos.
- Swagger e validação global foram reforçados.
- Regras de agendamento foram melhoradas: horário passado, conflito de horário, serviço da barbearia, horário de funcionamento, limite diário e cancelamento por antecedência.
