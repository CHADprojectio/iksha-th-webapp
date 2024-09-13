import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
	currentType: string
	phone: string
	name: string
}

// Define the initial state using that type
const initialState: CounterState = {
	currentType: '',
	phone: '',
	name: '',
}

export const counterSlice = createSlice({
	name: 'data',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setCurrentType: (state, action: PayloadAction<string>) => {
			state.currentType = action.payload
		},
		setCurrentPhone: (state, action: PayloadAction<string>) => {
			if (state.phone == '') state.phone = action.payload
		},
		setCurrentName: (state, action: PayloadAction<string>) => {
			if (state.name == '') state.name = action.payload
		},
	},
})

export const { setCurrentType, setCurrentPhone, setCurrentName } =
	counterSlice.actions

export default counterSlice.reducer
