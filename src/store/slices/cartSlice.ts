import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ICartItem from 'interfaces/ICartItem'

// Define a type for the slice state
export interface CartState {
	cart: ICartItem[]
}

// Define the initial state using that type
const initialState: CartState = {
	cart: [],
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (state, action: PayloadAction<ICartItem>) => {
			const existingItem = state.cart.find(
				item =>
					item.title === action.payload.title &&
					item.variant === action.payload.variant
			)
			if (existingItem) {
				existingItem.quantity += 1
			} else {
				state.cart.push({
					sheetName: action.payload.sheetName,
					photoUrl: action.payload.photoUrl,
					title: action.payload.title,
					price: action.payload.price,
					variant: action.payload.variant,
					quantity: action.payload.quantity,
				})
			}
		},
		changeQuantity: (
			state,
			action: PayloadAction<{
				title: string | undefined
				variant?: string
				newQuantity: number
			}>
		) => {
			if (!action.payload.title) return

			const item = state.cart.find(
				item =>
					item.title === action.payload.title &&
					item.variant === action.payload.variant
			)
			if (item) {
				item.quantity = action.payload.newQuantity
			}
		},
		incrementQuantity: (
			state,
			action: PayloadAction<{ title: string | undefined; variant?: string }>
		) => {
			if (!action.payload.title) return

			const item = state.cart.find(
				item =>
					item.title === action.payload.title &&
					item.variant === action.payload.variant
			)
			if (item) {
				item.quantity += 1
			}
		},
		decrementQuantity: (
			state,
			action: PayloadAction<{ title: string | undefined; variant?: string }>
		) => {
			if (!action.payload.title) return

			const item = state.cart.find(
				item =>
					item.title === action.payload.title &&
					item.variant === action.payload.variant
			)
			if (item && item.quantity > 1) {
				item.quantity -= 1
			} else if (item && item.quantity === 1) {
				state.cart = state.cart.filter(
					cartItem =>
						cartItem.title !== action.payload.title ||
						cartItem.variant !== action.payload.variant
				)
			}
		},
		removeFromCart: (
			state,
			action: PayloadAction<{ title: string; variant?: string }>
		) => {
			state.cart = state.cart.filter(
				item =>
					item.title !== action.payload.title ||
					item.variant !== action.payload.variant
			)
		},
	},
})

// Export actions
export const {
	addItemToCart,
	incrementQuantity,
	decrementQuantity,
	removeFromCart,
	changeQuantity,
} = cartSlice.actions

// Export reducer
export default cartSlice.reducer
