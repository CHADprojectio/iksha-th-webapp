import dataReducer, { type CounterState } from './slices/dataSlice'
import cartReducer, { type CartState } from './slices/cartSlice'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // импорт для работы с localStorage
import { combineReducers, type Reducer, type AnyAction } from 'redux'
import {configureStore} from "@reduxjs/toolkit";

// Комбинируем редюсеры
const rootReducer = combineReducers({
	data: dataReducer,
	cart: cartReducer,
})

export type RootState = {
	data: CounterState
	cart: CartState
}

// Настройка persist
const persistConfig = { key: 'root', storage }
const persistedReducer = persistReducer<RootState, AnyAction>(
	persistConfig,
	rootReducer as Reducer<RootState, AnyAction>
)

export const store = configureStore({
	reducer: persistedReducer, // используем persistReducer
})

export const persistor = persistStore(store) // Экспортируем persistor для использования в приложении

// Типизация RootState и AppDispatch
export type AppDispatch = typeof store.dispatch
