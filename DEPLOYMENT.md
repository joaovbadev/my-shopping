# Guia de Deployment - Vercel & Render

## Setup Inicial

### 1. Prepare seu repositório
```bash
# Faça commit dos arquivos de configuração
git add vercel.json render.yaml .env.example
git commit -m "feat: add Vercel and Render deployment configs"
git push
```

---

## **Frontend - Vercel**

### Passo 1: Conectar GitHub ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte sua conta GitHub
4. Selecione o repositório `my_shooping`

### Passo 2: Configurar Variáveis de Ambiente
No painel do Vercel, vá até **Settings → Environment Variables** e adicione:

```
NEXT_PUBLIC_API_URL = https://seu-api.onrender.com
```

(Você preencherá com a URL do Render depois)

### Passo 3: Deploy
- Vercel fará deploy automático ao fazer push para `master`
- Preview automático em PRs
- Seu frontend estará em: `https://seu-projeto.vercel.app`

---

## **Backend - Render**

### Passo 1: Criar Banco de Dados PostgreSQL
1. Acesse [render.com](https://render.com)
2. Clique em **New → PostgreSQL**
3. Configure:
   - **Name**: `my-shopping-db`
   - **Database**: `my_shopping`
   - **User**: `shopping`
   - **Region**: Escolha a mais próxima
4. Copie a **External Database URL** (você vai usar em breve)

### Passo 2: Criar Serviço Web (API)
1. Clique em **New → Web Service**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `my-shopping-api`
   - **Root Directory**: deixe em branco (monorepo)
   - **Build Command**:
     ```
     npm install && npm run build --workspace=apps/api
     ```
   - **Start Command**:
     ```
     npm run start:prod --workspace=apps/api
     ```

### Passo 3: Adicionar Variáveis de Ambiente
No Render, vá até **Environment** e adicione:

```
NODE_ENV = production
DATABASE_URL = {Cole a URL PostgreSQL do passo 1}
JWT_SECRET = {Gere uma chave segura}
FRONTEND_URL = https://seu-projeto.vercel.app
PORT = 10000
```

### Passo 4: Deploy e Setup de Banco
1. Clique em **Deploy** (Free tier leva uns minutos)
2. Assim que deployed, a URL será: `https://seu-api.onrender.com`

#### Preparar Banco de Dados:
No console do Render (Web Service → Shell), execute:
```bash
npm run db:push --workspace=apps/api
npm run db:seed --workspace=apps/api
```

---

## Atualizar Frontend com URL da API

Volte ao Vercel e atualize:
- **NEXT_PUBLIC_API_URL** = `https://seu-api.onrender.com`

Isso fará Vercel fazer um novo deploy automaticamente.

---

## Monitoramento

### Vercel
- Logs: Dashboard Vercel → seu projeto → "Logs"
- Métricas: Analytics automático

### Render
- Logs: Dashboard Render → seu serviço → "Logs"
- Métricas: CPU, Memória no Dashboard

---

## Troubleshooting

### API retorna erro de CORS
Adicione no Render:
```
FRONTEND_URL = https://seu-projeto.vercel.app
```

### Banco não conecta
- Verifique se `DATABASE_URL` está correta
- Render → Postgres → "Connections"
- Pode ser que precisa whitelist seu IP

### Redis não conecta
- Mesmo do banco acima
- Verifique `REDIS_URL` no Render

---

## Free Tier Limitações

| Serviço | Limite | Nota |
|---------|--------|------|
| **Vercel** | Unlimited | Sem taxa de inatividade |
| **Render API** | 750 horas/mês | ~25 dias. Dorme se inativo |
| **Render PostgreSQL** | 100 conexões, 256MB | Suficiente para início |

---

## Próximas Melhorias

1. **Domínio customizado**: Configure em ambos os serviços
2. **CI/CD**: Adicione testes antes de deploy (opcional)
3. **Monitoramento**: Integre Sentry ou similar para erros
4. **Backup**: PostgreSQL do Render faz backup automático

