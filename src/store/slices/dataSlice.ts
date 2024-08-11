import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import IDatabaseItem from '../../interfaces/IDatabaseItem'

// Define a type for the slice state
interface CounterState {
	food: IDatabaseItem[]
	services: IDatabaseItem[]
}

// Define the initial state using that type
const initialState: CounterState = {
	food: [],
	services: [],
}

export const counterSlice = createSlice({
	name: 'data',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setFood: (state, action: PayloadAction<IDatabaseItem[]>) => {
			state.food = action.payload
		},

		setServices: (state, action: PayloadAction<IDatabaseItem[]>) => {
			state.services = action.payload
		},
	},
})

export const { setFood, setServices } = counterSlice.actions

export default counterSlice.reducer
