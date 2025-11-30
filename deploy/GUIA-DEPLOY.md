# 🚀 Deploy - API Serviços Públicos

Guia simples e direto para deploy da API no cluster Kubernetes do IFRO.

---

## 📋 Pré-requisitos

- Cluster Kubernetes acessível
- `kubectl` configurado  
- Docker e Docker Compose instalados

---

## 🔧 Passo 1: Preparar ConfigMap

```bash
# Copiar template
cp deploy/servicos-publicos-configmap.example.yaml \
   deploy/servicos-publicos-configmap.secret.yaml

# Editar secrets
nano deploy/servicos-publicos-configmap.secret.yaml
```

**Gerar secrets seguros:**
```bash
openssl rand -base64 48
```

**Substituir no arquivo:**
- `JWT_SECRET_ACCESS_TOKEN`
- `JWT_SECRET_REFRESH_TOKEN`
- `JWT_SECRET_PASSWORD_RECOVERY`
- `MONGO_INITDB_ROOT_PASSWORD`

**Verificar URLs:**

```yaml
BASE_URL: "https://servicospublicos-api.app.fslab.dev"
FRONTEND_URL: "https://servicospublicos.app.fslab.dev"
DB_URL: "mongodb://servicospublicos:SENHA@servicos-mongodb-publicos:27017/servicosPublicos?authSource=admin"
```

---

## 🐋 Passo 2: Build e Push da Imagem
```bash
# Build
cd /home/yuri/Documentos/fabrica/servicos-publicos-api
docker build -t yurizetoles/servicos_publicos_api:latest .

# Push
docker push yurizetoles/servicos_publicos_api:latest

# Verificar
```bash
docker images | grep servicos_publicos_api
```
---

## 🚀 Passo 3: Deploy no Cluster

### 3.1 Aplicar ConfigMap
```bash
kubectl apply -f deploy/servicos-publicos-configmap.secret.yaml
```

### 3.2 Deploy MongoDB
```bash
kubectl apply -f deploy/servicos-db-publicos.yaml
kubectl wait --for=condition=ready pod -l io.kompose.service=servicos-mongodb-publicos --timeout=120s
```

### 3.3 Deploy API
```bash
kubectl apply -f deploy/servicos-api-publicos.yaml
```

### 3.4 Verificar Status
```bash
kubectl get all | grep publicos
```

**Saída esperada:**
```
pod/servicos-api-publicos-xxx           1/1     Running
pod/servicos-mongodb-publicos-xxx       1/1     Running
service/servicospublicos-api            ClusterIP
service/servicos-mongodb-publicos       ClusterIP
```

---

## 🌱 Passo 4: Executar Seeds

```bash
kubectl exec -it deployment/servicos-api-publicos -- npm run seed
```

**Saída esperada:**
```
✅ 6 rotas fixas inseridas
✅ 4 grupos fixos inseridas
✅ 6 secretarias fixas inseridas
✅ 19 usuários inseridos
✅ 13 demandas inseridas
>>> SEED FINALIZADO COM SUCESSO! <<<
```

**Credenciais criadas:**
- Admin: `admin@exemplo.com` / `Senha@123`
- Secretário: `secretario@exemplo.com` / `Senha@123`
- Operador: `operador@exemplo.com` / `Senha@123`

---

## ✅ Passo 5: Validar

### Testar HTTPS
```bash
curl -I https://servicospublicos-api.app.fslab.dev/
```

**Esperado:** `HTTP/1.1 302 Found` → `/docs`

### Acessar documentação
```
https://servicospublicos-api.app.fslab.dev/docs
```

### Testar login (cURL)
```bash
curl -X POST https://servicospublicos-api.app.fslab.dev/login \
  -H "Content-Type: application/json" \
  -d '{"identificador":"admin@exemplo.com","senha":"Senha@123"}'
```

### Ver logs
```bash
kubectl logs -f deployment/servicos-api-publicos
```

---

## 🔄 Atualizar Deployment

docker compose build
docker push yurizetoles/servicos_publicos_api:latest
kubectl rollout restart deployment/servicos-api-publicos
kubectl rollout status deployment/servicos-api-publicos
```
### Atualizar imagem
```bash
# Rebuild e push com tag (ex.: latest ou semver)
cd /home/yuri/Documentos/fabrica/servicos-publicos-api
docker build -t yurizetoles/servicos_publicos_api:latest .
docker push yurizetoles/servicos_publicos_api:latest
kubectl rollout restart deployment/servicos-api-publicos
kubectl rollout status deployment/servicos-api-publicos
```

### Atualizar ConfigMap
```bash
nano deploy/servicos-publicos-configmap.secret.yaml
kubectl apply -f deploy/servicos-publicos-configmap.secret.yaml
kubectl rollout restart deployment/servicos-api-publicos
```

### Rollback
```bash
kubectl rollout undo deployment/servicos-api-publicos
```

---

## 🗑️ Deletar Tudo

### Opção 1: Deletar um por um

```bash
# API
kubectl delete deployment servicos-api-publicos
kubectl delete service servicospublicos-api
kubectl delete configmap servicos-publicos-env

# MongoDB (⚠️ DELETA DADOS!)
kubectl delete deployment servicos-mongodb-publicos
kubectl delete service servicos-mongodb-publicos
kubectl delete pvc vol-servicos-mongodb-publicos
```

### Opção 2: Deletar tudo via arquivos

```bash
kubectl delete -f deploy/servicos-publicos-configmap.secret.yaml \
               -f deploy/servicos-db-publicos.yaml \
               -f deploy/servicos-api-publicos.yaml
```

**Verificar limpeza:**
```bash
kubectl get all | grep publicos
```

---

## 🔍 Troubleshooting

### Pod não inicia
```bash
kubectl logs deployment/servicos-api-publicos --tail=50
kubectl describe pod <nome-do-pod>
```

### Erro de conexão com MongoDB
```bash
# Verificar MongoDB rodando
kubectl get pods | grep mongodb

# Testar conectividade
kubectl exec -it deployment/servicos-api-publicos -- sh
wget -O- http://servicos-mongodb-publicos:27017
exit
```

### API não responde via HTTPS
```bash
# Verificar Service (nome DEVE ser servicospublicos-api)
kubectl get svc servicospublicos-api

# Testar internamente
kubectl run test-curl --image=curlimages/curl:latest --rm -it --restart=Never -- \
  curl -I http://servicospublicos-api:80/
```

---

## 📘 Informações

### Portas
- API: 5011 (interna) → Service porta 80
- MongoDB: 27017

### URLs
- **API (interna):** http://servicospublicos-api:80
- **API (produção):** https://servicospublicos-api.app.fslab.dev
- **Documentação:** https://servicospublicos-api.app.fslab.dev/docs

### Arquivos
```
deploy/
├── servicos-publicos-configmap.secret.yaml  # Produção (NÃO commitar!)
├── servicos-publicos-configmap.example.yaml # Template
├── servicos-db-publicos.yaml                # MongoDB
├── servicos-api-publicos.yaml               # API
└── GUIA-DEPLOY.md                           # Este guia
```

---

**Última atualização:** 22/11/2025
