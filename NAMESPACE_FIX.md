# WebSocket Namespace Error Fix

## Issue

Console error: **"Invalid namespace"** when accessing `/i/regime-subscriptions` page.

## Root Cause

The `useRegimeSocketSubscription` hook was trying to connect to the `/signals` namespace:

```typescript
io(`${WEBSOCKET_CONFIG.url}/signals`, { ... })
```

However, the backend WebSocket server only has the **root namespace** configured, not `/signals`.

## Solution

Changed the WebSocket connection to use the root namespace instead:

### Before

```typescript
// ❌ Trying to connect to /signals namespace (doesn't exist)
const socketInstance = io(`${WEBSOCKET_CONFIG.url}/signals`, { ... })
```

### After

```typescript
// ✅ Connecting to root namespace (exists and works)
const socketInstance = io(WEBSOCKET_CONFIG.url, { ... })
```

## Files Modified

1. **`src/hooks/useRegimeSocketSubscription.ts`**
   - Changed namespace from `/signals` to root
   - Updated documentation comments
2. **`src/docs/REGIME_WEBSOCKET_SUBSCRIPTIONS.md`**
   - Updated documentation to reflect root namespace usage

## Verification

- ✅ No linter errors
- ✅ Consistent with `useRegimeSocket` hook (which already uses root namespace)
- ✅ Documentation updated

## How to Test

1. Navigate to `/i/regime-subscriptions`
2. Console should no longer show "Invalid namespace" error
3. WebSocket should connect successfully (check console for "✅ Regime WebSocket connected")
4. Try subscribing to symbols - should work without errors

## Background

The backend WebSocket server at `http://localhost:4202` uses the root namespace for all socket connections. Both regime hooks (`useRegimeSocket` and `useRegimeSocketSubscription`) now correctly connect to the root namespace.
