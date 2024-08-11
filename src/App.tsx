import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/mainPage/MainPage'
import CatalogPage from './pages/catalogPage/CatalogPage'

const App = () => (
	<div>
		<Routes>
			<Route element={<MainPage />} path='/' />
			<Route element={<CatalogPage />} path='/catalog' />
		</Routes>
	</div>
)

export default App
