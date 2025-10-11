# Trade Front - Market Regime Analysis Dashboard

Next.js проект для анализа рыночных режимов с real-time обновлениями через WebSocket.

## ✨ Особенности

- 🎯 **Market Regime Detection** - определение рыночного режима (Range, Squeeze, Trending Bull/Bear, Expansion)
- 📊 **Real-time Sparklines** - SVG и PNG графики ADX/ATR%
- 🚨 **Health Monitoring** - мониторинг здоровья пайплайна с алертами
- 🔄 **WebSocket Integration** - live обновления данных
- 🎨 **Modern UI** - Tailwind CSS + SCSS Modules
- 📱 **Responsive Design** - адаптивный дизайн

## 🚀 Быстрый старт

**Запустите dev сервер (порт очищается автоматически!):**

```bash
npm run dev
```

Откройте [http://localhost:3003](http://localhost:3003) в браузере.

> 💡 Порт 3003 автоматически освобождается перед запуском благодаря `predev` hook!

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 📚 Документация проекта

### Market Regime System

- [MARKET_REGIME_COMPLETE.md](./MARKET_REGIME_COMPLETE.md) - полная документация системы
- [HEALTH_CONTEXT_WIDGETS.md](./HEALTH_CONTEXT_WIDGETS.md) - Health & Context виджеты
- [PNG_SPARKLINES_AND_ALERTS.md](./PNG_SPARKLINES_AND_ALERTS.md) - PNG графики и алерты
- [SPARKLINES_AND_FILTERS_INTEGRATION.md](./SPARKLINES_AND_FILTERS_INTEGRATION.md) - спарклайны и фильтры

### Управление портами

- [scripts/PORT_MANAGEMENT.md](./scripts/PORT_MANAGEMENT.md) - управление портами

### Backend

- [REGIME_BACKEND_EXAMPLE.md](./REGIME_BACKEND_EXAMPLE.md) - настройка backend

## 🎯 Основные компоненты

- `RegimeWidget` - виджет отображения режима с графиками
- `RegimeHealth` - мониторинг здоровья пайплайна
- `RegimeContext` - LTF/HTF контекст для сигналов
- `RegimeAlertToast` - всплывающие алерты (в layout.tsx)
- `SignalsList` - список сигналов с фильтрацией по режиму
- `Sparkline` / `PngSparkline` - SVG/PNG графики

## 🔧 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202
```

## 🌐 Страницы

- `/i` - User Dashboard
- `/i/regime-dashboard` - Advanced Regime Dashboard
- `/auth` - Аутентификация

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
