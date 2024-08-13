import { Reducer, combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore
} from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
// import { filterSlice } from './filters/filters.slice'


import { userSlice } from './user/user.slice'

const isClient = typeof window !== 'undefined'
const combinedReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
})

type RootState = ReturnType<typeof combinedReducer>
type RootStateWithPersist = RootState & Partial<PersistPartial>

let mainReducer: Reducer<RootState> = combinedReducer
if (isClient) {
	const persistConfig = {
		key: 'menu',
		storage,
		whiteList: ['menu']
	}

	mainReducer = persistReducer(
		persistConfig,
		combinedReducer
	) as Reducer<RootStateWithPersist>
}

export const store = configureStore({
	reducer: mainReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE]
			}
		})
})

export const persistor = persistStore(store)
export type TypeRootState = ReturnType<typeof combinedReducer> &
	Partial<PersistPartial>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
