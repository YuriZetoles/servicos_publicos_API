
# Documentação da API - Serviços Públicos - Vilhena+ Pública

O nosso sistema tem como objetivo, possibilitar uma comunicação entre a prefeitura de Vilhena-RO e seus munícipes, facilitando o acesso aos serviços públicos, onde o site irá permitir cadastro e gerenciamento de usuários e demandas.

---

## 1. Autenticação

### 1.1 POST /login *(millestone 3)*

#### Caso de Uso
- Permitir que os usuários (ou sistemas externos) entrem no sistema e obtenham acesso às funcionalidades internas.

#### Regras de Negócio
- Verificação de Credenciais: Validar login/senha.
- Bloqueio de Usuários:  Impedir o acesso de usuários desativados ou não confirmados.
- Gestão de Tokens: Gerar e armazenar tokens de acesso e refresh de forma segura, permitindo revogação futura.

#### Resultado Esperado
- Retorno dos tokens de acesso e refresh.
- Retorno da página principal de acordo com o tipo de usuário que fizer o login no sistema.
- Em caso de erro, mensagem de erro: "E-mail já cadastrado" ou "Dados inválidos".

### 1.2 POST /signup

#### Caso de Uso
- Permitir que novos usuários se cadastrem no sistema para acessar as funcionalidades do aplicativo, criando uma conta com suas informações pessoais.

#### Regras de Negócio
- Validação de Dados: Verificar se os campos obrigatórios (nome, e-mail, senha, telefone, grupo) 
- Exclusividade de Identificadores: Verificar que campos únicos, como e-mail ou CPF/CNPJ, não estejam já cadastrados.
- Status Inicial: Definir um status inicial para o novo usuário
- Criptografia de Senha: Armazenar a senha de forma segura.
- Campo grupo: Deve ser uma string singular representando o perfil (Munícipe, Secretário, Operador, Administrador)

#### Resultado Esperado
- Criação bem-sucedida de uma nova conta de usuário, armazenando todos os dados fornecidos com segurança.
- Retorno da página inicial logada com todas as funcionalidades do sistema disponíveis ao usuário.
- Em caso de falha, retorno de mensagens de erro específicas (ex.: "E-mail já cadastrado", "Senha fora do padrão").

### 1.3 POST /logout

#### Caso de Uso
- Permitir que usuários autenticados encerrem sua sessão no sistema.

#### Regras de Negócio
- O usuário deve estar autenticado (token válido).
- A sessão do usuário é revogada.
- Todos os tokens associados à sessão são invalidados.

#### Resultado Esperado
- O sistema retorna confirmação de logout e o usuário é desconectado.

### 1.4 POST /revoke

#### Caso de Uso
- Revogar um ou mais tokens de acesso, invalidando sessões específicas.

#### Regras de Negócio
- O usuário deve estar autenticado.
- Os tokens informados são marcados como revogados.

#### Resultado Esperado
- Confirmação de revogação dos tokens.

### 1.5 POST /refresh

#### Caso de Uso
- Renovar o token de acesso usando um refresh token válido.

#### Regras de Negócio
- Um refresh token válido deve ser enviado.
- Um novo token de acesso é gerado.
- O refresh token pode ser rotacionado.

#### Resultado Esperado
- Retorno de um novo token de acesso (e opcionalmente um novo refresh token).

### 1.6 POST /recover

#### Caso de Uso
- Iniciar o processo de recuperação de senha para usuários que esqueceram sua senha.

#### Regras de Negócio
- O e-mail do usuário deve ser informado.
- Um e-mail de recuperação com token é enviado.
- Este endpoint possui rate limiting rigoroso.

#### Resultado Esperado
- Confirmação de que o e-mail de recuperação foi enviado.

### 1.7 PATCH /password/reset

#### Caso de Uso
- Redefinir a senha do usuário usando um token de recuperação válido.

#### Regras de Negócio
- Um token de recuperação válido deve ser fornecido.
- A nova senha deve seguir os requisitos de segurança.
- Este endpoint possui rate limiting rigoroso.

#### Resultado Esperado
- Confirmação de que a senha foi redefinida com sucesso.

### 1.8 POST /introspect

#### Caso de Uso
- Validar e introspeccionar um token, retornando informações sobre sua validade e payload.

#### Regras de Negócio
- O token deve ser enviado no header de autorização.
- O sistema valida o token e retorna suas informações.

#### Resultado Esperado
- Retorno das informações do token (claims, validade, etc).

### 1.9 GET /verificar-email

#### Caso de Uso
- Verificar e confirmar o e-mail de um usuário durante o processo de signup.

#### Regras de Negócio
- Um token de verificação deve ser fornecido como query parameter.
- O e-mail é confirmado e o usuário ativado.

#### Resultado Esperado
- Confirmação de que o e-mail foi verificado com sucesso.


## 2. Demandas

### 2.1 GET /demandas 

#### Caso de Uso
- O sistema deve retornar todas as demandas registradas, podendo aplicar filtros por query string (como status, secretariaId, etc).

#### Regras de Negócio
- Se houver query, será validada por DemandaQuerySchema.
- Se não houver query, lista tudo.
- Pode ser usado por secretarias, operadores ou administradores para visualizar o fluxo de demandas.

#### Resultado Esperado
-O sistema retorna uma lista com todas as demandas existentes, contendo informações como título, descrição, status, data de criação, etc.

### 2.2 GET /demandas/:id

#### Caso de Uso
- Obter os detalhes completos de uma demanda específica a partir do seu ID.

#### Regras de Negócio
- O ID da demanda é validado por DemandaIdSchema.
- Caso o ID não seja válido, o sistema retorna um erro 400.
- Deve retornar apenas uma demanda correspondente ao ID fornecido.

#### Resultado Esperado
- O sistema retorna todas as informações da demanda solicitada, como título, descrição, status atual, data de criação e a secretaria vinculada.
- Em caso de não encontrar, retorna "Recurso não encontrado em demanda.".

### 2.3 POST /demandas

#### Caso de Uso
- Permitir que um usuario do tipo munícipe crie uma nova demanda, informando os dados necessários.

#### Regras de Negócio
- Os dados da requisição (body) devem conter todos os campos obrigatórios válidos.
- Caso algum campo obrigatório esteja ausente ou inválido, a validação Zod impedirá a criação e retornará um erro 400.
- A demanda é criada com status inicial "Em aberto".
- O munícipe é automaticamente associado como criador da demanda (adicionado ao array "usuarios").
- A secretaria é automaticamente vinculada com base no tipo da demanda.
- Operadores não podem criar demandas através desta rota.
- Os campos "feedback", "avaliacao_resolucao", "resolucao", "motivo_devolucao" e "link_imagem_resolucao" são removidos automaticamente ao criar.
- Arrays de imagens (link_imagem, link_imagem_resolucao) aceitam múltiplas URLs.

#### Resultado Esperado
- O sistema registra a nova demanda e retorna uma confirmação de criação com os dados fornecidos, além do ID gerado automaticamente.
- Status inicial é "Em aberto".

### 2.4 PATCH /demandas/:id

#### Caso de Uso
- Atualizar informações de uma demanda existente.

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- Os dados enviados devem seguir o DemandaUpdateSchema.
- Apenas munícipes e administradores podem atualizar demandas.
- Os campos "tipo" e "data" são removidos automaticamente (não podem ser alterados).
- Os campos "resolucao", "motivo_devolucao" e "link_imagem_resolucao" são removidos automaticamente.
- A atualização só é realizada se a demanda existir.
- Os arrays de imagens (link_imagem) podem ser atualizados com múltiplas URLs.

#### Resultado Esperado
- O sistema atualiza os campos da demanda e retorna uma mensagem de sucesso junto com os novos dados modificados, exceto os campos ocultados (tipo, data).

### 2.5 DELETE /demandas/:id

#### Caso de Uso
- Excluir uma demanda registrada no sistema, geralmente por decisão do criador ou administrador.

#### Regras de Negócio
- O ID informado na URL é validado pelo DemandaIdSchema.
- Caso o ID não seja fornecido ou seja inválido, o sistema retorna um erro personalizado informando a necessidade do ID.
- Se a demanda existir, ela será excluída do banco de dados.
- A exclusão mantém a integridade referencial com outras coleções.

#### Resultado Esperado
- O sistema remove a demanda e retorna uma mensagem de confirmação informando que a exclusão foi concluída com sucesso, junto com os dados da demanda que foi excluída.

### 2.6 PATCH /demandas/:id/atribuir

#### Caso de Uso
- Permitir que um secretário (responsável por uma secretaria) atribua uma demanda a um ou mais operadores para execução.

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- O corpo da requisição deve conter um array "usuarios" com IDs de operadores.
- Apenas secretários podem atribuir demandas.
- O secretário só pode atribuir demandas vinculadas à sua secretaria.
- Todos os usuários no array devem ser do tipo "operador" (validação obrigatória).
- O array de usuarios não pode estar vazio.
- Usuários munícipes já associados à demanda são mantidos automaticamente na lista.
- Atribuir uma demanda muda o status de "Em aberto" para "Em andamento".
- A operação valida as permissões e secretarias antes de atribuir.

#### Resultado Esperado
- O sistema atualiza a demanda com os operadores designados, retornando uma mensagem confirmando a atribuição com sucesso, incluindo os dados atualizados da demanda.

### 2.7 PATCH /demandas/:id/resolver

#### Caso de Uso
- Permitir que o operador responsável pela demanda marque-a como concluída, indicando que a execução foi finalizada com evidência.

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- A demanda deve estar em status "Em andamento".
- Apenas operadores podem resolver demandas.
- O operador deve enviar documentação da execução (descrição na propriedade "resolucao").
- Imagens de comprovação são salvas em "link_imagem_resolucao" como array de URLs.
- A mudança de status vai de "Em andamento" para "Concluída".
- A resolução é permanente; uma demanda resolvida não pode ser modificada.

#### Resultado Esperado
- A demanda é atualizada com o status "Concluída", salvando a descrição e as imagens de comprovação. O sistema retorna uma mensagem de sucesso com os dados atualizados da demanda.

### 2.8 PATCH /demandas/:id/devolver

#### Caso de Uso
- Permitir que operadores ou secretários devolvam uma demanda, revertendo-a ao status "Em aberto" para reavaliação.

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- Operadores podem devolver demandas atribuídas a eles, removendo-se da lista de usuarios.
- Secretários podem recusar demandas (devolver com status "Recusada") e devem fornecer "motivo_rejeicao".
- Se for secretário devolvendo (recusando), o campo "motivo_rejeicao" é obrigatório.
- A demanda deve estar em status "Em andamento" para ser devolvida por operador.
- Após devolução por operador, a demanda volta para "Em aberto".
- Após recusa por secretário, a demanda fica com status "Recusada" com motivo registrado.

#### Resultado Esperado
- A demanda é desatribuída do operador (se aplicável) ou recusada com motivo (se secretário), e o sistema retorna uma mensagem confirmando a devolução com os dados atualizados da demanda.

### 2.9 POST /demandas/:id/foto/:tipo

#### Caso de Uso
- Permitir upload de imagens para uma demanda, diferenciando entre imagens da criação (tipo: "criacao") e imagens de resolução (tipo: "resolucao").

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- O parâmetro "tipo" deve ser "criacao" ou "resolucao".
- Um arquivo de imagem deve ser enviado; caso contrário, retorna erro 400.
- O arquivo é processado e armazenado, atualizando o array correspondente (link_imagem ou link_imagem_resolucao).
- Apenas usuários com permissão podem fazer upload (validado via AuthMiddleware e AuthPermission).

#### Resultado Esperado
- Upload realizado com sucesso, retornando mensagem de sucesso e dados atualizados da demanda com a nova URL da imagem no array correspondente.

### 2.10 DELETE /demandas/:id/foto/:tipo

#### Caso de Uso
- Permitir remoção de imagens de uma demanda.

#### Regras de Negócio
- O ID da demanda é validado (DemandaIdSchema).
- O parâmetro "tipo" deve ser "criacao" ou "resolucao".
- A imagem é removida do array correspondente (link_imagem ou link_imagem_resolucao).
- Apenas usuários com permissão podem deletar imagens.

#### Resultado Esperado
- Imagem removida com sucesso, retornando mensagem de sucesso e dados atualizados da demanda.

## 3. Secretarias

### 3.1 GET /secretaria

#### Caso de Uso
- Permitir que o sistema ou um usuário autorizado liste todas as secretarias cadastradas, com possibilidade de filtro via query.

#### Regras de Negócio
- Pode ou não conter filtros por nome e/ou sigla.
- As queries devem ser validadas por SecretariaQuerySchema.

#### Resultado Esperado
- Retorna um array com todas as secretarias cadastradas, contendo dados como nome, sigla, e-mail, e telefone.

### 3.2 GET /secretaria/:id

#### Caso de Uso
- Permitir que o sistema ou um usuário autorizado recupere os dados completos de uma secretaria específica pelo ID.

#### Regras de Negócio
- O ID fornecido na rota deve ser válido conforme o SecretariaIDSchema.
- Caso não exista secretaria com esse ID, retorna erro 404.

#### Resultado Esperado
- Retorna os dados detalhados da secretaria correspondente ao ID fornecido, como nome, e-mail e telefone.

### 3.3 POST /secretaria

#### Caso de Uso
- Permitir que o administrador do sistema cadastre uma nova secretaria no banco de dados.

#### Regras de Negócio
- O corpo da requisição deve seguir as validações definidas no SecretariaSchema.
- Todos os campos obrigatórios devem ser enviados.
- Não pode haver outra secretaria com o mesmo nome ou sigla.

#### Resultado Esperado
- A nova secretaria é criada com sucesso no banco e retorna os dados da secretaria recém-criada, incluindo seu ID.

### 3.4 PATCH /secretaria/:id

#### Caso de Uso
- Permitir que o administrador do sistema atualize os dados de uma secretaria existente.

#### Regras de Negócio
- O ID da secretaria deve ser válido (SecretariaIDSchema).
- O corpo da requisição deve respeitar o SecretariaUpdateSchema.
- O nome ou sigla não pode ser duplicado em relação a outra secretaria.

#### Resultado Esperado
- A secretaria é atualizada com os novos dados fornecidos e o sistema retorna a confirmação da atualização com os dados atualizados.

### 3.5 DELETE /secretaria/:id

#### Caso de Uso
- Permitir que o administrador delete uma secretaria do sistema, caso ela não esteja vinculada a demandas ativas.

#### Regras de Negócio
- O ID deve ser válido (SecretariaIDSchema).
- Caso a secretaria tenha demandas ativas vinculadas, não pode ser deletada(*Millestone 3*).
- O sistema deve validar a existência da secretaria antes da exclusão.

#### Resultado Esperado
- A secretaria é excluída do banco de dados e o sistema retorna uma mensagem de sucesso confirmando a exclusão e os dados da secretraia excluída.

## 4. Tipos de Demanda

### 4.1 GET /tipoDemanda

#### Caso de Uso
- Permitir que o sistema ou um usuário autorizado liste todos os tipos de demanda disponíveis no sistema.

#### Regras de Negócio
- As queries são validadas via Zod.
- A listagem ocorre mesmo se nenhuma query for enviada.

#### Resultado Esperado
- Retorna um array com todos os tipos de demanda cadastrados, contendo dados como nome, descrição e status.

### 4.2 GET /tipoDemanda/:id

#### Caso de Uso
- Permitir que o sistema ou um usuário autorizado recupere os dados de um tipo de demanda específico, utilizando o ID como parâmetro.

#### Regras de Negócio
- O ID da rota deve ser validado pelo TipoDemandaIDSchema.
- Caso o ID não exista no banco, deve retornar erro 404.

#### Resultado Esperado
- Retorna os dados do tipo de demanda correspondente ao ID fornecido, como titulo, descrição, icone, etc.

### 4.3 `POST /tipoDemanda

#### Caso de Uso
- Permitir que o administrador cadastre um novo tipo de demanda no sistema.

#### Regras de Negócio
- O corpo da requisição deve seguir o TipoDemandaSchema.
- Campos obrigatórios como nome e descrição devem ser enviados.
- Não deve permitir a criação de tipos de demanda com nomes duplicados.

#### Resultado Esperado
- O tipo de demanda é criado com sucesso e retorna os dados do registro recém-criado, incluindo seu ID.

### 4.4 PATCH /tipoDemanda/:id

#### Caso de Uso
- Permitir que o administrador atualize os dados de um tipo de demanda existente.

#### Regras de Negócio
- O ID deve ser validado com o TipoDemandaIDSchema.
- Os dados enviados devem seguir o TipoDemandaUpdateSchema.
- Não pode haver duplicação de nomes com outros tipos de demanda.

#### Resultado Esperado
- Os dados do tipo de demanda são atualizados com sucesso e o sistema retorna os novos dados com uma mensagem de confirmação.

### 4.5 DELETE /tipoDemanda/:id

#### Caso de Uso
- Permitir que o administrador exclua um tipo de demanda do sistema, caso ele não esteja vinculado a nenhuma demanda ativa.

#### Regras de Negócio
- O ID deve ser válido e validado com TipoDemandaIDSchema.
- Caso o tipo de demanda esteja associado a demandas existentes, a exclusão deve ser impedida (verificado no service).
- A existência do tipo de demanda deve ser verificada antes de excluí-lo.

#### Resultado Esperado
- O tipo de demanda é removido com sucesso do banco de dados e o sistema retorna uma mensagem de sucesso e os dados do TipoDemanda excluído.

### 4.6 POST /tipoDemanda/:id/foto

#### Caso de Uso
- Permitir upload de um ícone/imagem para um tipo de demanda.

#### Regras de Negócio
- O ID do tipo de demanda é validado (TipoDemandaIDSchema).
- Um arquivo de imagem deve ser enviado; caso contrário, retorna erro 400.
- O arquivo é processado e armazenado, atualizando o campo de imagem do tipo de demanda.
- Apenas administradores podem fazer upload de ícones para tipos de demanda.

#### Resultado Esperado
- Upload realizado com sucesso, retornando mensagem de sucesso e dados atualizados do tipo de demanda com a nova URL da imagem.

### 4.7 DELETE /tipoDemanda/:id/foto

#### Caso de Uso
- Permitir remoção do ícone/imagem de um tipo de demanda.

#### Regras de Negócio
- O ID do tipo de demanda é validado (TipoDemandaIDSchema).
- A imagem é removida do armazenamento e do registro do tipo de demanda.
- Apenas administradores podem deletar ícones de tipos de demanda.

#### Resultado Esperado
- Imagem removida com sucesso, retornando mensagem de sucesso e dados atualizados do tipo de demanda sem a imagem.

## 5. Usuários

### 5.1 GET /usuarios e GET /usuarios/:id

#### Caso de Uso
- Listar todos os usuários ou consultar um usuário específico pelo ID.

#### Regras de Negócio
- Se o parâmetro id for passado, deve ser validado.
- A consulta pode aceitar filtros via query string, validados pelo UsuarioQuerySchema.
- Se o usuário solicitado não existir, retorna erro 404.

#### Resultado Esperado
- Retorna uma lista de usuários (ou um usuário específico) com os dados públicos, exceto os campos ocultados.

### 5.2 POST /usuarios

#### Caso de Uso
- Criar um novo usuário no sistema.

#### Regras de Negócio
- Os dados recebidos devem obedecer ao UsuarioSchema.
- Campos obrigatórios, como nome, email e senha, devem ser fornecidos.
- Campos internos como senha são excluídos da resposta por segurança.
- Deve garantir que o email seja único.

#### Resultado Esperado
- Usuário criado com sucesso, retornando os dados do usuário criado, sem a senha.

### 5.3 PATCH /usuarios/:id

#### Caso de Uso
- Atualizar os dados de um usuário existente.

#### Regras de Negócio
- O ID do usuário deve ser validado.
- Os dados atualizados devem estar no formato do UsuarioUpdateSchema.
- Campos internos como senha e email são excluídos da resposta por segurança.
- A atualização só é realizada se o usuario existir.

#### Resultado Esperado
- O sistema atualiza os campos de usuario e retorna uma mensagem de sucesso junto com os novos dados modificados, exceto os campos ocultados.

### 5.4 DELETE /usuarios/:id

#### Caso de Uso
- Excluir um usuário do sistema.

#### Regras de Negócio
- O ID deve ser validado.
- O usuário deve existir para ser excluído, caso contrário erro 404.
- Se o ID não for fornecido, retorna erro 400.

#### Resultado Esperado
- Usuário excluído com sucesso, com mensagem confirmando a exclusão.

### 5.5 POST /usuarios/:id/foto

#### Caso de Uso
- Permitir que o usuário faça upload de uma foto de perfil.

#### Regras de Negócio
- O ID do usuário deve ser validado.
- Um arquivo de imagem deve ser enviado; caso contrário, retorna erro 400.
- O serviço processa e salva a imagem, atualizando o usuário com o link da foto.

#### Resultado Esperado
- Upload realizado com sucesso, retornando mensagem de sucesso, link para a foto e metadados do arquivo.

### 5.6 DELETE /usuarios/:id/foto

#### Caso de Uso
- Permitir que o usuário remova sua foto de perfil.

#### Regras de Negócio
- O ID do usuário deve ser validado.
- A foto é removida do armazenamento e do registro do usuário.
- Apenas o próprio usuário ou administrador podem remover sua foto.

#### Resultado Esperado
- Imagem removida com sucesso, retornando mensagem de sucesso e dados do usuário sem a foto.

## 6. Grupos

### 6.1 GET /grupos e GET /grupos/:id

#### Caso de Uso
- Listar todos os grupos disponíveis no sistema ou consultar um grupo específico pelo ID.

#### Regras de Negócio
- Se o parâmetro id for passado, deve ser validado.
- Apenas usuários autenticados podem consultar grupos.
- A listagem retorna grupos disponíveis para consulta.

#### Resultado Esperado
- Retorna uma lista de grupos ou um grupo específico com seus dados (nome, descrição, permissões).

### 6.2 POST /grupos

#### Caso de Uso
- Criar um novo grupo de usuários no sistema.

#### Regras de Negócio
- Apenas administradores podem criar grupos.
- Os dados recebidos devem incluir nome e descrição do grupo.
- O nome do grupo deve ser único.
- Permissões devem ser válidas e existentes.

#### Resultado Esperado
- Grupo criado com sucesso, retornando os dados do grupo recém-criado, incluindo seu ID.

### 6.3 PATCH /grupos/:id

#### Caso de Uso
- Atualizar os dados de um grupo existente.

#### Regras de Negócio
- O ID do grupo deve ser validado.
- Apenas administradores podem atualizar grupos.
- O nome do grupo não pode ser duplicado.
- As permissões devem ser válidas.

#### Resultado Esperado
- O grupo é atualizado com sucesso e o sistema retorna os dados atualizados.

### 6.4 DELETE /grupos/:id

#### Caso de Uso
- Excluir um grupo do sistema.

#### Regras de Negócio
- O ID deve ser validado.
- Apenas administradores podem deletar grupos.
- Grupos com usuários associados podem ter restrições de exclusão.

#### Resultado Esperado
- Grupo excluído com sucesso, com mensagem confirmando a exclusão.

## 7. Permissões e Controle de Acesso (RBAC)

### 7.1 Hierarquia de Perfis

O sistema implementa controle de acesso baseado em papéis (RBAC) com a seguinte hierarquia:

| Perfil | Descrição | Permissões |
|--------|-----------|-----------|
| Administrador | Acesso total ao sistema | Todas as operações em todos os recursos |
| Secretário | Gerencia demandas de sua secretaria | Atribuir operadores, recusar demandas, visualizar demandas da secretaria |
| Operador | Executa demandas atribuídas | Resolver demandas, devolver demandas, visualizar demandas atribuídas |
| Munícipe | Cria e acompanha demandas | Criar demandas, atualizar suas demandas, visualizar suas demandas |

### 7.2 Controle de Acesso por Rota

#### Demandas
- GET /demandas: Todos os perfis (filtrado por permissões)
  - Administrador: Todas as demandas
  - Secretário: Demandas de suas secretarias
  - Operador: Demandas atribuídas a ele
  - Munícipe: Suas demandas
  
- GET /demandas/:id: Acesso condicional
  - Secretário: Apenas demandas de suas secretarias
  - Operador: Apenas se atribuído na demanda
  - Munícipe: Apenas suas demandas
  
- POST /demandas: Apenas munícipes
  - Operadores são bloqueados
  
- PATCH /demandas/:id: Munícipes e administradores
  
- PATCH /demandas/:id/atribuir: Apenas secretários
  - Validação de secretaria obrigatória
  
- PATCH /demandas/:id/resolver: Apenas operadores
  
- PATCH /demandas/:id/devolver: Operadores e secretários
  - Operadores: removem a si mesmos
  - Secretários: recusam com motivo obrigatório
  
- DELETE /demandas/:id: Munícipes e administradores

#### Rota /demandas/meus
- Filtra automaticamente baseado no perfil e nas secretarias do usuário
- Munícipe: Retorna apenas suas demandas
- Secretário: Retorna demandas de suas secretarias
- Operador: Retorna demandas atribuídas a ele (dentro de suas secretarias)

### 7.3 Validações de Dados

#### Campos Obrigatórios por Operação

**POST /demandas (Criação):**
- tipo (enum: Coleta, Iluminação, Saneamento, Árvores, Animais, Pavimentação)
- descricao
- endereco.logradouro
- endereco.bairro
- endereco.numero
- endereco.cidade
- endereco.estado

**PATCH /demandas/:id/atribuir:**
- usuarios[] (array não vazio, todos do tipo operador)

**PATCH /demandas/:id/devolver:**
- motivo_rejeicao (obrigatório se secretário)
- motivo_devolucao (optional se operador)

**PATCH /demandas/:id/resolver:**
- resolucao (descrição da execução)
- link_imagem_resolucao[] (array de URLs de comprovação)

### 7.4 Status de Demanda

| Status | Descrição | Transições Válidas |
|--------|-----------|-------------------|
| Em aberto | Demanda criada, aguardando atribuição | -> Em andamento (atribuir) |
| Em andamento | Demanda atribuída a operador | -> Concluída (resolver), -> Recusada (secretário devolver), -> Em aberto (operador devolver) |
| Concluída | Demanda resolvida e comprovada | Final (não há transições) |
| Recusada | Demanda recusada pelo secretário | Final (não há transições) |

### 7.5 Arrays de Imagens

- link_imagem: Imagens da demanda criada
  - Tipo: Array de strings (URLs)
  - Quantidade: 0 ou mais URLs
  - Formato: JPG, PNG
  
- link_imagem_resolucao: Imagens de comprovação da resolução
  - Tipo: Array de strings (URLs)
  - Quantidade: 0 ou mais URLs
  - Obrigatório ao resolver: Sim (pelo menos uma imagem recomendada)
  - Formato: JPG, PNG