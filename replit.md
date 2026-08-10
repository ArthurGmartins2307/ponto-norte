# Logística Monitor

Painel operacional para acompanhar cotações de moedas e condições climáticas de rotas de entrega.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/logistica-monitor/` — painel web com visão geral, rotas e histórico.
- `artifacts/api-server/src/routes/logistics.ts` — coleta atual de câmbio e temperatura.
- `lib/api-spec/openapi.yaml` — contrato da API e fonte dos tipos gerados.
- `scripts/buscar_dados_logistica.py` — script Python obrigatório fornecido pelo usuário.

## Architecture decisions

- O painel usa hooks gerados a partir do contrato OpenAPI para manter frontend e API sincronizados.
- A temperatura atual é exibida, mas o painel não inventa alertas de tempestade sem precipitação ou campo de alerta.
- A rota Express reproduz a coleta pública do script Python para o preview web, sem alterar o script Python original.

## Product

O produto mostra dólar, euro e temperatura atual de São Paulo, informa a qualidade da leitura e destaca quando os dados são insuficientes para confirmar risco meteorológico.

## User preferences

- O arquivo `scripts/buscar_dados_logistica.py` deve permanecer exatamente com o código Python fornecido pelo usuário, sem adicionar, remover ou alterar linhas.

## Gotchas

- A API gratuita de câmbio pode responder com limite de cota (`429`); nesse caso o painel deve mostrar indisponibilidade, nunca valores inventados.
- O script Python obrigatório coleta somente temperatura atual; alertas de tempestade exigiriam novos dados, mas não devem ser adicionados ao script obrigatório.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
