import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
	currentType: string
}

// Define the initial state using that type
const initialState: CounterState = {
	currentType: '',
}

export const counterSlice = createSlice({
	name: 'data',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setCurrentType: (state, action: PayloadAction<string>) => {
			state.currentType = action.payload
		},
	},
})

export const { setCurrentType } = counterSlice.actions

export default counterSlice.reducer
