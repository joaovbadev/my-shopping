#!/bin/bash

echo "🚀 My Shopping - Deployment Helper"
echo ""
echo "Escolha uma opção:"
echo "1) Verificar build (local)"
echo "2) Ver instruções Vercel"
echo "3) Ver instruções Render"
echo "4) Validar .env"
echo ""

read -p "Opção (1-4): " option

case $option in
  1)
    echo ""
    echo "🔨 Buildando o projeto..."
    npm run build
    if [ $? -eq 0 ]; then
      echo "✅ Build bem-sucedido!"
      echo ""
      echo "Próximo passo:"
      echo "  git add ."
      echo "  git commit -m 'chore: deploy changes'"
      echo "  git push"
    else
      echo "❌ Build falhou. Verifique os erros acima."
      exit 1
    fi
    ;;
  2)
    echo ""
    cat << 'EOF'
📋 VERCEL SETUP
===============

1. Acesse: https://vercel.com/new
2. Conecte seu repositório GitHub
3. Selecione: my_shooping
4. Deixe as settings padrão (Next.js framework será detectado)
5. Clique "Deploy"

Variáveis de Ambiente:
- Nome: NEXT_PUBLIC_API_URL
- Valor: https://seu-api.onrender.com (preenchida depois)

Deploy automático ao fazer push para master!
EOF
    ;;
  3)
    echo ""
    cat << 'EOF'
📋 RENDER SETUP
===============

ORDEM IMPORTANTE:
1️⃣ PostgreSQL → Copie a URL externa
2️⃣ Web Service (API)

Para Web Service:
- Build: npm install && npm run build --workspace=apps/api
- Start: npm run start:prod --workspace=apps/api

Variáveis de Ambiente:
- NODE_ENV: production
- DATABASE_URL: (Cole do PostgreSQL)
- JWT_SECRET: (Gere uma chave segura)
- FRONTEND_URL: https://seu-projeto.vercel.app
- PORT: 10000

Após deploy, rode no console Render:
- npm run db:push --workspace=apps/api
- npm run db:seed --workspace=apps/api
EOF
    ;;
  4)
    echo ""
    if [ -f .env ]; then
      echo "✅ .env existe"
      echo ""
      echo "Variáveis detectadas:"
      grep "=" .env | cut -d'=' -f1
    else
      echo "⚠️  .env não encontrado!"
      echo ""
      echo "Copie o template:"
      echo "  cp .env.example .env"
      echo "  # Edite .env com seus valores"
    fi
    ;;
  *)
    echo "Opção inválida"
    exit 1
    ;;
esac
