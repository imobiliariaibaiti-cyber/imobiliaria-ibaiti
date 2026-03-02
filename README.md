# Imobiliária Ibaiti

Projeto full stack para gestão e exibição de imóveis rurais.

## Estrutura

- `frontend/`: Next.js + Tailwind (site público + painel admin)
- `backend/`: Node.js + Express + Prisma + PostgreSQL

## Funcionalidades já implementadas

- Home com hero, destaques, sobre e contato
- Listagem `/imoveis` com filtros por tipo, cidade e preço
- Página individual `/imoveis/[id]`
- Login admin `/admin`
- Painel `/admin/imoveis` com cadastro, edição, exclusão e destaque
- API REST com autenticação JWT
- Upload de imagens via Cloudinary
- SEO técnico base (metadata, Open Graph, canonical)

## Backend

1. Entre na pasta:
   - `cd backend`
2. Instale dependências:
   - `npm install`
3. Configure variáveis:
   - copie `.env.example` para `.env`
4. Configure o banco PostgreSQL em `DATABASE_URL`
5. Gere o client e aplique migração:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
6. Rode a API:
   - `npm run dev`

API por padrão em `http://localhost:4000`.

## Frontend

1. Entre na pasta:
   - `cd frontend`
2. Instale dependências:
   - `npm install`
3. Configure variáveis:
   - copie `.env.example` para `.env.local`
4. Rode o frontend:
   - `npm run dev`

Frontend por padrão em `http://localhost:3000`.

## Endpoints da API

- `GET /properties`
- `GET /properties/:id`
- `POST /admin/properties`
- `PUT /admin/properties/:id`
- `DELETE /admin/properties/:id`
- `POST /upload`
- `POST /auth/login`

## Deploy sugerido

- Banco: Supabase ou Railway (PostgreSQL)
- Upload: Cloudinary
- Backend: Render ou Railway
- Frontend: Vercel

## Próximos passos recomendados

- Adicionar paginação na listagem
- Adicionar proteção de rota admin no frontend com middleware
- Criar tabela de leads e salvar formulários de contato
- Integrar Pixel Meta e Google Ads

