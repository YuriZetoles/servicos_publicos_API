# Deploy - API Serviços Públicos

## Build & Push

```bash
cd /home/yuri/Documentos/fabrica/servicos-publicos-api
docker build -t yurizetoles/servicos_publicos_api:latest .
docker push yurizetoles/servicos_publicos_api:latest
```

## Deploy MongoDB (primeira vez)

```bash
kubectl apply -f deploy/servicos-db-publicos.yaml
```

## Deploy Produção

```bash
kubectl apply -f deploy/servicos-db-publicos.yaml
kubectl apply -f deploy/servicos-publicos-configmap.secret.yaml
kubectl apply -f deploy/servicos-api-publicos.yaml
kubectl exec -it deployment/servicos-api-publicos -- npm run seed
```

## Atualizar Produção

```bash
docker build -t yurizetoles/servicos_publicos_api:latest .
docker push yurizetoles/servicos_publicos_api:latest
kubectl rollout restart deployment/servicos-api-publicos
```

## Deploy QA

```bash
kubectl apply -f deploy/servicos-publicos-qa-configmap.secret.yaml
kubectl apply -f deploy/servicos-api-publicos-qa.yaml
kubectl exec -it deployment/servicos-api-publicos-qa -- npm run seed
```

## Atualizar QA

```bash
docker build -t yurizetoles/servicos_publicos_api:latest .
docker push yurizetoles/servicos_publicos_api:latest
kubectl rollout restart deployment/servicos-api-publicos-qa
```

## Deletar

```bash
kubectl delete -f deploy/servicos-api-publicos.yaml
kubectl delete -f deploy/servicos-publicos-configmap.secret.yaml
kubectl delete -f deploy/servicos-db-publicos.yaml
kubectl delete -f deploy/servicos-api-publicos-qa.yaml
kubectl delete -f deploy/servicos-publicos-qa-configmap.secret.yaml
```

## Verificar

```bash
kubectl get pods | grep servicos
kubectl logs -f deployment/servicos-api-publicos
kubectl logs -f deployment/servicos-api-publicos-qa
```

## URLs

- Produção: https://servicospublicos-api.app.fslab.dev
- QA: https://servicospublicos-api-qa.app.fslab.dev
