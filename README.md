Site
https://porjetofinalweb.vercel.app/


💈 Sistema de Agendamento para Barbearias

Este projeto é uma API desenvolvida com NestJS e Sequelize, com o objetivo de conectar barbearias e clientes, permitindo o gerenciamento de agendamentos, serviços e horários disponíveis.

O sistema permite que clientes encontrem barbearias próximas ou pelo nome, visualizem serviços e valores, e realizem agendamentos de forma organizada e segura.

## 📋 Regras de Negócio

- ❗ Não pode agendar horário já ocupado
- ❗ Cliente não pode ter dois agendamentos no mesmo horário
- ❗ Barbeiro só pode atender dentro do horário de funcionamento
- ❗ Cancelamento só até X horas antes
- ❗ Só pode avaliar se já teve atendimento
- ❗ Barbeiro não pode excluir horário com agendamento
- ❗ Serviço só pode ser usado se pertence à barbearia
- ❗ Limite de agendamentos por dia
- ❗ Usuário não pode se auto-promover para ADMIN
- ❗ Horário passado não pode ser reservado
