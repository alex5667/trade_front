# Управление портами

## 🚨 Проблема: Порт занят

Если вы видите ошибку:

```
Error: listen EADDRINUSE: address already in use :::3003
```

## ✅ Решения

### 1. Использовать скрипт (рекомендуется)

```bash
# Освободить порт 3003
./scripts/kill-port.sh 3003

# Или любой другой порт
./scripts/kill-port.sh 4000
```

### 2. Ручные команды

```bash
# Найти процесс на порту 3003
lsof -i :3003

# Убить процесс
fuser -k 3003/tcp

# Или
lsof -ti:3003 | xargs kill -9
```

### 3. Проверить статус портов

```bash
# Все занятые порты
ss -tuln | grep LISTEN

# Конкретный порт
ss -tuln | grep :3003

# Процессы на портах
lsof -i -P -n | grep LISTEN
```

### 4. Использовать другой порт

В `package.json` измените порт или используйте переменную окружения:

```bash
PORT=3001 npm run dev
```

## 🔧 Часто используемые порты

- **3000** - Next.js dev сервер (по умолчанию)
- **3003** - Trade Front (текущий проект)
- **4202** - WebSocket сервер (Regime)
- **4207** - REST API backend

## 💡 Советы

1. **Перед запуском проверяйте порт:**

   ```bash
   ./scripts/kill-port.sh 3003
   npm run dev
   ```

2. **Создайте алиас в `.bashrc` или `.zshrc`:**

   ```bash
   alias killport='fuser -k'
   # Использование: killport 3003/tcp
   ```

3. **Используйте разные порты для разных проектов:**
   ```bash
   # .env.local
   PORT=3003
   ```

## 🛠️ Troubleshooting

### Процесс не убивается

```bash
# С правами sudo
sudo fuser -k 3003/tcp

# Или найдите PID и убейте вручную
lsof -i :3003
kill -9 <PID>
```

### Порт остается занятым после kill

```bash
# Подождите несколько секунд
sleep 2

# Проверьте снова
ss -tuln | grep :3003
```

### Permission denied

```bash
# Используйте sudo
sudo lsof -ti:3003 | sudo xargs kill -9
```
