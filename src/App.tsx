import { Route, Routes, useNavigate } from 'react-router-dom'
import MainPage from './pages/mainPage/MainPage'
import CatalogPage from './pages/catalogPage/CatalogPage'
import cart from 'icons/cart.png'
import back from 'icons/back.png'
import CartPage from './pages/cartPage/CartPage'
import { useEffect, useState } from 'react'
import ErrorPage from './pages/errorPage/ErrorPage'

const App = () => {
	const navigate = useNavigate()
	const [isCartOpen, setIsCartOpen] = useState(false)
	const toggleCartOpen = () => setIsCartOpen(!isCartOpen)
	const [theme, setTheme] = useState<'dark' | 'light'>('light')

	useEffect(() => {
		if (window.Telegram?.WebApp) {
			const tg = window.Telegram.WebApp
			console.log(tg)
			console.log(tg?.colorScheme)
			setTheme(tg?.colorScheme)
			// You can also initialize or interact with tg here
		} else {
			console.error('Telegram WebApp is not available')
		}
	}, [])

	return (
		<div className={`relative ${theme == 'dark' ? 'dark' : 'light'}`}>
			<div className='fixed flex flex-col gap-3 z-[100] right-2 bottom-2'>
				<div
					onClick={toggleCartOpen}
					className='p-2 rounded-full cursor-pointer bg-button bottom-5 w-[50px] h-[50px] '
				>
					<img src={cart} alt='cart' />
				</div>

				<div
					onClick={() => {
						navigate('/')
					}}
					className='p-2 rounded-full cursor-pointer bg-button bottom-10 w-[50px] h-[50px] '
				>
					<img src={back} alt='back' />
				</div>
			</div>
			{isCartOpen && <CartPage />}
			<Routes>
				<Route element={<MainPage />} path='/' />
				<Route element={<CatalogPage />} path='/catalog' />
				<Route element={<ErrorPage />} path='*' />
			</Routes>
		</div>
	)
}

export default App
