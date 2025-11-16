FROM node:22

# Instalar dependências do sistema necessárias para os scripts
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Garantir permissão de execução para scripts
RUN chmod +x /app/scripts/*.sh 2>/dev/null || true

ENTRYPOINT [ "npm" ]
CMD [ "start" ]

