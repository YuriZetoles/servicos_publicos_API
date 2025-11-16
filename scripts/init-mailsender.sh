# scripts/init-mailsender.sh
#!/bin/bash
# Script para inicializar a API Key do Mailsender

set -e

echo "Aguardando Mailsender estar pronto..."
sleep 5

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://mailsender-servicos:5016/api/status > /dev/null 2>&1; then
        echo "Mailsender está pronto!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Tentativa $RETRY_COUNT/$MAX_RETRIES - Aguardando Mailsender..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "Timeout aguardando Mailsender"
    exit 1
fi

echo "Verificando API Key existente..."

# Verifica se já existe uma chave para servicos-publicos-api
EXISTING_KEY=$(curl -s http://mailsender-servicos:5016/api/keys 2>/dev/null | grep -o "servicos-publicos-api" || echo "")

if [ -z "$EXISTING_KEY" ]; then
    echo "Gerando nova API Key..."
    
    # Gera nova API Key
    API_KEY_RESPONSE=$(curl -s -X POST http://mailsender-servicos:5016/api/keys/generate \
        -H "Content-Type: application/json" \
        -d '{"name":"servicos-publicos-api"}')
    
    # Extrai a API Key da resposta
    API_KEY=$(echo $API_KEY_RESPONSE | grep -o '"apiKey":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$API_KEY" ]; then
        echo "API Key gerada: ${API_KEY:0:16}..."
        echo "Salvando API Key no arquivo .env..."
        
        # Atualiza o .env com a nova API Key
        sed -i "s|MAIL_API_KEY=.*|MAIL_API_KEY=\"$API_KEY\"|" /app/.env
        
        echo "API Key configurada com sucesso!"
    else
        echo "Falha ao gerar API Key, usando a existente no .env"
    fi
else
    echo "API Key já existe para servicos-publicos-api"
fi

echo "Iniciando aplicação..."
exec "$@"
