/**
 * Хук авторизации
 * --------------------------------
 * Предоставляет доступ к состоянию аутентификации пользователя
 * Возвращает текущего пользователя из Redux store
 */

import { useTypedSelector } from './useTypedSelector'

/** Хук для получения состояния авторизации пользователя */
export const useAuth = () => useTypedSelector(state => state.user)
