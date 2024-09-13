import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './slices/dataSlice'
import cartReducer from './slices/cartSlice'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // импорт для работы с localStorage
import { combineReducers } from 'redux'

// Комбинируем редюсеры
const rootReducer = combineReducers({
	data: dataReducer,
	cart: cartReducer,
})

// Настройка persist
const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer, // используем persistReducer
})

export const persistor = persistStore(store) // Экспортируем persistor для использования в приложении

// Типизация RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
