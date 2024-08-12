import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@telegram-apps/telegram-ui/dist/styles.css'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from 'store/store.ts'
import LoadingComponent from 'shared/LoadingComponent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AppRoot>
				<Provider store={store}>
					<Suspense fallback={<LoadingComponent />}>
						<App />
					</Suspense>
				</Provider>
			</AppRoot>
		</BrowserRouter>
	</React.StrictMode>
)
