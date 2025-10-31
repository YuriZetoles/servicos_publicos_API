# 🚀 Serviços Públicos API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-blue.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-553%20✅-brightgreen.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Sobre o Projeto

O projeto **Serviços Públicos** é uma API REST desenvolvida para promover a participação cidadã, permitindo que munícipes registrem demandas diretamente às secretarias responsáveis. A plataforma oferece uma interface simples e acessível para envio de solicitações relacionadas a diversas áreas municipais como coleta de lixo, saneamento, iluminação pública, animais abandonados, entre outras.

### 🎯 Objetivos Principais
- ✅ Facilitar a comunicação entre cidadãos e governo municipal
- ✅ Promover transparência no atendimento de demandas públicas
- ✅ Otimizar processos administrativos
- ✅ Garantir controle e rastreabilidade de solicitações

## 📋 Funcionalidades

### 👥 Gestão de Usuários
- 🔐 Cadastro e autenticação de usuários
- 👤 Perfis diferenciados (Cidadão, Operador, Secretário)
- 🔑 Controle de acesso baseado em permissões
- 📸 Upload de fotos de perfil

### 📝 Gestão de Demandas
- 📋 Criação e acompanhamento de demandas públicas
- 📊 Controle de status (Aberta, Em Andamento, Resolvida, Devolvida)
- 🖼️ Upload de imagens nas demandas
- 📍 Geolocalização e endereçamento completo
- 🏷️ Categorização por tipo de demanda

### 🏢 Gestão Administrativa
- 👥 Gerenciamento de secretarias municipais
- 📋 Controle de tipos de demanda
- 👤 Atribuição de demandas por secretários
- 🔄 Devolução de demandas por operadores
- 📈 Relatórios e estatísticas

### 🛡️ Segurança e Performance
- 🚦 Rate limiting para proteção contra abuso
- 🔒 Autenticação JWT com refresh tokens
- ✅ Validação rigorosa de dados com Zod
- 📊 Logs estruturados para auditoria
- 🐳 Containerização com Docker

## 🏗️ Arquitetura

### Tecnologias Principais
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Banco de Dados**: MongoDB com Mongoose ODM
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod schemas
- **Armazenamento**: MinIO (S3-compatible)
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest com Supertest
- **Containerização**: Docker & Docker Compose

### Estrutura do Projeto
```
src/
├── app.js                 # Configuração principal da aplicação
├── server.js              # Inicialização do servidor
├── config/
│   └── dbConnect.js       # Conexão com MongoDB
├── controllers/           # Controladores da API
├── middlewares/           # Middlewares customizados
├── models/               # Modelos Mongoose
├── repository/           # Camada de acesso a dados
├── routes/               # Definição das rotas
├── services/             # Lógica de negócio
├── utils/                # Utilitários e helpers
└── docs/                 # Documentação Swagger
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ e npm
- MongoDB 8.0+
- Docker (opcional, mas recomendado)

### 1. Clone o Repositório
```bash
git clone https://gitlab.fslab.dev/f-brica-de-software-ii-2025-1/servicos-publicos.git
cd servicos-publicos
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp .env.example .env
```

**Variáveis obrigatórias:**
```env
# Banco de Dados
DB_URL=mongodb://localhost:27017/servicos-publicos

# JWT
JWT_SECRET=sua-chave-secreta-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-aqui

# MinIO (Armazenamento)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=fs3-public-services

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app

# Ambiente
NODE_ENV=development
```

### 4. Execute os Seeds (Dados Iniciais)
```bash
npm run seed
```

### 5. Execute a Aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🐳 Executando com Docker

### Ambiente de Desenvolvimento
```bash
# Subir containers
docker compose -f docker-compose-dev.yml up -d

# Ver logs
docker compose -f docker-compose-dev.yml logs -f

# Parar containers
docker compose -f docker-compose-dev.yml down
```

### Ambiente de Produção
```bash
# Subir containers
docker compose up -d

# Reconstruir e subir
docker compose up --build --force-recreate
```

## 🧪 Testes

### Executar Todos os Testes
```bash
npm test
```

### Executar com Cobertura
```bash
npm run test:coverage
```

### Executar Testes Específicos
```bash
# Testes de uma pasta específica
npm test -- src/test/controllers

# Testes de um arquivo específico
npm test -- src/test/controllers/AuthController.test.js
```

**Status dos Testes:** ✅ 553 testes passando

## 📚 Documentação da API

### Swagger UI
Acesse a documentação interativa em: `http://localhost:5011/docs`

### Endpoints Principais

#### Utilitários
- `GET /` - Redirecionamento para documentação
- `GET /docs` - Documentação Swagger UI
- `GET /health` - Health check da aplicação

#### Autenticação
- `POST /login` - Login de usuário
- `POST /refresh` - Renovar token de acesso

#### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário
- `GET /usuarios/:id` - Buscar usuário por ID
- `PATCH /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

#### Demandas
- `GET /demandas` - Listar demandas
- `POST /demandas` - Criar demanda
- `GET /demandas/:id` - Buscar demanda por ID
- `PATCH /demandas/:id` - Atualizar demanda
- `DELETE /demandas/:id` - Deletar demanda

#### Secretarias
- `GET /secretarias` - Listar secretarias
- `POST /secretarias` - Criar secretaria
- `GET /secretarias/:id` - Buscar secretaria por ID
- `PATCH /secretarias/:id` - Atualizar secretaria
- `DELETE /secretarias/:id` - Deletar secretaria

#### Tipos de Demanda
- `GET /tipos-demanda` - Listar tipos de demanda
- `POST /tipos-demanda` - Criar tipo de demanda
- `GET /tipos-demanda/:id` - Buscar tipo por ID
- `PATCH /tipos-demanda/:id` - Atualizar tipo
- `DELETE /tipos-demanda/:id` - Deletar tipo

## 🔒 Segurança

### Rate Limiting
- **Limite**: 7 requisições por minuto por IP
- **Bloqueio**: Status 429 (Too Many Requests)
- **Cabeçalho**: `X-RateLimit-Remaining`

### Autenticação JWT
- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- **Rotas Protegidas**: Middleware de autenticação obrigatório

### Validação de Dados
- **Schema Validation**: Zod para validação rigorosa
- **Sanitização**: Dados limpos e seguros
- **Tipos**: Validação de tipos e formatos

## 📊 Monitoramento

### Logs Estruturados
- **Níveis**: info, warn, error
- **Formato**: JSON estruturado
- **Contexto**: Service, timestamp, requestId

### Health Checks
- **Endpoint**: `GET /health`
- **Status**: Verificação de conectividade do banco de dados
- **Resposta**: JSON com status, database, timestamp e uptime

### Padrões de Código
- ESLint para linting
- Prettier para formatação
- Commits convencionais
- Testes obrigatórios para novas funcionalidades

## 📈 Scripts Disponíveis

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

## 👥 Equipe

| Nome | Função | E-mail |
|------|--------|--------|
| Giullia Beatriz Chiarotti | Analista e Gerente de Projeto | giulliachiarotti@gmail.com |
| Luis Felipe Lopes | Analista | luis.felipe.lopes1275@gmail.com |
| Danielle Silva de Melo | Analista | danielleesilva.4@gmail.com |
| Yuri Ribeiro Zetoles | Analista | yurizetoles0123@gmail.com |