# Navalha Prime — Frontend Next.js

Frontend em Next.js para o sistema de barbearia.

## O que o frontend possui

- Login com token JWT.
- Controle de acesso por perfil.
- Menu diferente para gerente, funcionário e cliente.
- Tabelas com filtro e paginação.
- Modais de criação, edição, visualização e exclusão.
- Camada de serviços Axios separada da camada visual.
- Telas para as entidades principais do sistema.

## Telas

- Login
- Início
- Unidades
- Usuários
- Serviços
- Agenda
- Profissionais
- Horários
- Categorias
- Produtos
- Cupons
- Avaliações

## Estrutura

- `app/`: rotas e telas.
- `components/`: componentes reutilizáveis.
- `src/services/`: chamadas Axios.
- `src/data/`: tratamento de parâmetros.
- `src/lib/`: sessão, API, permissões e formatações.
- `src/types/`: tipos TypeScript.

## Componentes do trabalho

### Simples

- `AppButton`
- `StatusBadge`

### Média complexidade

- `UserForm`
- `ServiceForm`
- `AppointmentForm`
- `BarbershopForm`

### Complexo

- `DataTable`
- `GenericCrudPage`

## Rodar

```bash
npm install
copy .env.example .env.local
npm run dev -- -p 3001
```
