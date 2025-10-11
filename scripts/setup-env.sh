#!/bin/bash

# Скрипт для автоматической настройки .env.local
# Использование: ./scripts/setup-env.sh

echo "🔧 Настройка переменных окружения..."

ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  Файл $ENV_FILE уже существует"
    read -p "Перезаписать? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Отменено"
        exit 0
    fi
fi

cat > "$ENV_FILE" << 'EOF'
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api

# WebSocket Configuration
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202

# Optional: Enable/Disable WebSocket
NEXT_PUBLIC_WEBSOCKET_ENABLED=true

# Optional: Mock Data Mode (если backend недоступен)
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF

if [ $? -eq 0 ]; then
    echo "✅ Файл $ENV_FILE создан успешно!"
    echo ""
    echo "📝 Содержимое:"
    cat "$ENV_FILE"
    echo ""
    echo "🚀 Теперь запустите: npm run dev"
else
    echo "❌ Ошибка при создании файла $ENV_FILE"
    exit 1
fi

exit 0


