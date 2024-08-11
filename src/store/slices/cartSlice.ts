import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import IDatabaseItem from 'interfaces/IDatabaseItem'

interface ICartItem {
	title: string
	price: number
	quantity: number
}

// Define a type for the slice state
interface CartState {
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
		// Action to add an item to the cart
		addItemToCart: (state, action: PayloadAction<IDatabaseItem>) => {
			const existingItem = state.cart.find(
				item => item.title === action.payload.title
			)
			if (existingItem) {
				existingItem.quantity += 1
			} else {
				state.cart.push({
					title: action.payload.title,
					price: action.payload.price,
					quantity: 1,
				})
			}
		},

		// Action to increment the quantity of an item in the cart
		incrementQuantity: (
			state,
			action: PayloadAction<{ title: string | undefined }>
		) => {
			if (!action.payload.title) return

			const item = state.cart.find(
				item => item.title === action.payload.title
			)
			if (item) {
				item.quantity += 1
			}
		},

		// Action to decrement the quantity of an item in the cart
		decrementQuantity: (
			state,
			action: PayloadAction<{ title: string | undefined }>
		) => {
			if (!action.payload.title) return
			const item = state.cart.find(
				item => item.title === action.payload.title
			)
			if (item && item.quantity > 1) {
				item.quantity -= 1
			} else if (item && item.quantity === 1) {
				// Optionally, remove the item from the cart if quantity is 1 and decrement is triggered
				state.cart = state.cart.filter(
					cartItem => cartItem.title !== action.payload.title
				)
			}
		},

		// Action to remove an item from the cart by title
		removeFromCart: (state, action: PayloadAction<{ title: string }>) => {
			state.cart = state.cart.filter(
				item => item.title !== action.payload.title
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
} = cartSlice.actions

// Export reducer
export default cartSlice.reducer
