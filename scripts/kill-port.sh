#!/bin/bash

# Скрипт для освобождения порта
# Использование: ./scripts/kill-port.sh 3003

PORT=${1:-3003}

echo "🔍 Проверяем порт $PORT..."

if lsof -i :$PORT > /dev/null 2>&1; then
    echo "⚠️  Порт $PORT занят, освобождаем..."
    fuser -k $PORT/tcp 2>/dev/null
    
    # Дополнительная проверка
    sleep 1
    if lsof -i :$PORT > /dev/null 2>&1; then
        echo "❌ Не удалось освободить порт $PORT"
        echo "💡 Попробуйте: sudo fuser -k $PORT/tcp"
        exit 1
    else
        echo "✅ Порт $PORT успешно освобожден!"
    fi
else
    echo "✅ Порт $PORT уже свободен"
fi

exit 0

