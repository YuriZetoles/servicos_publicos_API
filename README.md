# 🚀 Serviços Públicos - API

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-blue.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-553%20✅-brightgreen.svg)](https://jestjs.io/)

API REST para gestão de demandas públicas municipais desenvolvida com Node.js, Express e MongoDB.

## 📋 Sobre o Projeto

Plataforma que promove a participação cidadã permitindo que munícipes registrem demandas diretamente às secretarias responsáveis (coleta de lixo, saneamento, iluminação pública, etc).

**Objetivos:**
- ✅ Facilitar comunicação cidadão-governo
- ✅ Promover transparência
- ✅ Otimizar processos administrativos
- ✅ Garantir rastreabilidade

## 🎯 Funcionalidades

### 👥 Gestão de Usuários
- Cadastro e autenticação (JWT)
- Perfis: Cidadão, Operador, Secretário, Admin
- Upload de fotos de perfil
- Recuperação de senha via email

### 📝 Gestão de Demandas
- CRUD completo de demandas
- Status: Aberta → Em Andamento → Resolvida/Devolvida
- Upload de imagens (até 3 por demanda)
- Geolocalização e endereçamento

### 🏢 Gestão Administrativa
- Gerenciamento de secretarias
- Categorização de demandas
- Atribuição por secretários
- Relatórios e estatísticas

### 🛡️ Segurança
- Rate limiting (7 req/min)
- Autenticação JWT com refresh tokens
- Validação rigorosa (Zod)
- Logs estruturados
- Containerização Docker

## 🚀 Quick Start

> **IMPORTANTE:** Execute os containers pelo **frontend**. Veja o [README do Frontend](../servicos-publicos-front/README.md).

### Apenas para Desenvolvimento Local da API

Se quiser rodar **apenas a API** isoladamente:

```bash
# 1. Configure credenciais de email
# 1.1 Gere senha de aplicativo Gmail: https://myaccount.google.com/apppasswords
# 1.2 Cadastre no Mailsender: https://mailsender.app.fslab.dev/cadastro
#     - Nome: Nome do projeto
#     - Email: Seu email Gmail
#     - Senha: Senha de aplicativo gerada
# 1.3 Copie a API Key gerada

# 2. Configure variáveis de ambiente
nano .env
# URL_MAIL_SERVICE="https://mailsender.app.fslab.dev/api/emails/send"
# MAIL_API_KEY="sua-api-key-copiada-do-mailsender"

# 3. Inicie
docker compose -f docker-compose-dev.yml up --build

# 4. Popule banco
docker compose -f docker-compose-dev.yml exec api npm run seed

# 5. Teste
docker compose -f docker-compose-dev.yml exec api npm test
```

## 📚 Documentação da API

### Acesso
- **Swagger UI:** http://localhost:5011/docs
- **Health Check:** http://localhost:5011/health

### Endpoints Principais

#### Autenticação
```
POST   /login              - Login
POST   /refresh            - Renovar token
POST   /logout             - Logout
POST   /recover            - Recuperar senha
PATCH  /password/reset     - Redefinir senha
POST   /signup             - Cadastro público
```

#### Usuários
```
GET    /usuarios           - Listar
POST   /usuarios           - Criar
GET    /usuarios/:id       - Buscar por ID
PATCH  /usuarios/:id       - Atualizar
DELETE /usuarios/:id       - Deletar
```

#### Demandas
```
GET    /demandas           - Listar
POST   /demandas           - Criar
GET    /demandas/:id       - Buscar por ID
PATCH  /demandas/:id       - Atualizar
DELETE /demandas/:id       - Deletar
```

#### Secretarias
```
GET    /secretarias        - Listar
POST   /secretarias        - Criar
GET    /secretarias/:id    - Buscar por ID
PATCH  /secretarias/:id    - Atualizar
DELETE /secretarias/:id    - Deletar
```

#### Tipos de Demanda
```
GET    /tipos-demanda      - Listar
POST   /tipos-demanda      - Criar
GET    /tipos-demanda/:id  - Buscar por ID
PATCH  /tipos-demanda/:id  - Atualizar
DELETE /tipos-demanda/:id  - Deletar
```

## 🔒 Segurança

### Rate Limiting
- **Limite:** 7 requisições/minuto por IP
- **Resposta:** Status 429
- **Header:** `X-RateLimit-Remaining`

### Autenticação JWT
- **Access Token:** Expira em 15 minutos
- **Refresh Token:** Expira em 7 dias
- **Rotas Protegidas:** Middleware obrigatório

### Validação (Zod)
- Schema validation rigoroso
- Sanitização de dados
- Validação de tipos

### Requisitos de Senha
```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```
- Mínimo 8 caracteres
- 1 maiúscula, 1 minúscula
- 1 número
- 1 caractere especial (@, $, !, %, *, ?, &)

## 📊 Monitoramento

### Logs Estruturados
- Níveis: info, warn, error
- Formato: JSON
- Contexto: Service, timestamp, requestId

### Health Check
```bash
curl http://localhost:5011/health
```

Resposta:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-16T12:00:00.000Z",
  "uptime": 3600
}
```

## 🧪 Testes

```bash
# Todos os testes
docker compose -f docker-compose-dev.yml exec api npm test

# Com cobertura
docker compose -f docker-compose-dev.yml exec api npm run test:coverage

# Watch mode
docker compose -f docker-compose-dev.yml exec api npm run test:watch
```

**Resultado:** 553 testes passando ✅

## 🏗️ Arquitetura

```
src/
├── app.js              # Configuração Express
├── server.js           # Inicialização
├── config/
│   └── dbConnect.js    # MongoDB
├── controllers/        # Lógica de controle
├── middlewares/        # Middlewares customizados
├── models/            # Schemas Mongoose
├── repository/        # Acesso a dados
├── routes/            # Rotas
├── services/          # Lógica de negócio
├── utils/             # Utilitários
├── seeds/             # Dados iniciais
└── docs/              # Swagger
```

## � Scripts NPM

```json
{
  "dev": "nodemon server.js",
  "start": "node server.js",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "seed": "node src/seeds/seeds.js",
  "lint": "eslint src/**/*.js",
  "lint:fix": "eslint src/**/*.js --fix"
}
```

## �️ Stack Tecnológica

- **Runtime:** Node.js 22+
- **Framework:** Express.js
- **Banco:** MongoDB 8 com Mongoose ODM
- **Auth:** JWT (access + refresh tokens)
- **Validação:** Zod schemas
- **Storage:** MinIO (S3-compatible)
- **Docs:** Swagger/OpenAPI
- **Testes:** Jest + Supertest
- **Container:** Docker & Docker Compose
- **Email:** Mailsender (custom service)

## 👥 Equipe

| Nome | Função | E-mail |
|------|--------|--------|
| Giullia Beatriz Chiarotti | Analista e Gerente de Projeto | giulliachiarotti@gmail.com |
| Luis Felipe Lopes | Analista | luis.felipe.lopes1275@gmail.com |
| Danielle Silva de Melo | Analista | danielleesilva.4@gmail.com |
| Yuri Ribeiro Zetoles | Analista | yurizetoles0123@gmail.com |

## 📄 Licença

> ### Este projeto está licenciado sob a [Licença MIT](./LICENSE).