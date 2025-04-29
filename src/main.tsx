import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@telegram-apps/telegram-ui/dist/styles.css'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from 'store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
		<BrowserRouter>
			<AppRoot>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						<App />
					</PersistGate>
				</Provider>
			</AppRoot>
		</BrowserRouter>
)
