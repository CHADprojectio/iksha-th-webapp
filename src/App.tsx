import { Route, Routes, useNavigate } from 'react-router-dom'

import cart from 'icons/cart.png'
import back from 'icons/back.png'
import CartPage from './pages/cartPage/CartPage'
import { lazy, useEffect, useState } from 'react'
import { IconButton } from '@telegram-apps/telegram-ui'

const ErrorPage = lazy(() => import('./pages/errorPage/ErrorPage'))
const CatalogPage = lazy(() => import('./pages/catalogPage/CatalogPage'))
const MainPage = lazy(() => import('./pages/mainPage/MainPage'))
const CheckoutPage = lazy(() => import('./pages/checkoutPage/CheckoutPage'))
const SuccessPage = lazy(() => import('./pages/successPage/SuccessPage'))
const FailurePage = lazy(() => import('./pages/failurePage/FailurePage'))

const App = () => {
	const navigate = useNavigate()
	const [isCartOpen, setIsCartOpen] = useState(false)
	const toggleCartOpen = () => setIsCartOpen(!isCartOpen)
	const [theme, setTheme] = useState<'dark' | 'light'>('dark')

	// useEffect(() => {
	// 	if (window.Telegram?.WebApp) {
	// 		const tg = window.Telegram.WebApp
	// 		console.log(tg)
	// 		console.log(tg?.colorScheme)
	// 		setTheme(tg?.colorScheme)
	// 		// You can also initialize or interact with tg here
	// 	} else {
	// 		console.error('Telegram WebApp is not available')
	// 	}
	// }, [])

	return (
		<div className={`relative ${theme == 'dark' ? 'dark' : 'light'}`}>
			<div className='fixed flex flex-col gap-3 z-[10] right-2 bottom-[70px]'>
				{/* <IconButton
					onClick={() => {
						navigate('/')
						setIsCartOpen(false)
					}}
					className='w-[50px] rounded-full h-[50px] '
					mode='bezeled'
					size='l'
				>
					<img src={back} alt='back' />
				</IconButton> */}

				<IconButton
					onClick={toggleCartOpen}
					className='w-[50px] rounded-full h-[50px] '
					mode='bezeled'
					size='l'
				>
					{/* className='p-2 rounded-full cursor-pointer bg-button bottom-5 */}

					<img src={cart} alt='cart' />
				</IconButton>
			</div>
			{isCartOpen && <CartPage toggleCartOpen={toggleCartOpen} />}
			<Routes>
				<Route element={<MainPage />} path='/' />
				<Route element={<CatalogPage />} path='/catalog' />
				<Route element={<CheckoutPage />} path='/checkout' />
				<Route element={<SuccessPage />} path='/success' />
				<Route element={<FailurePage />} path='/failure' />
				<Route element={<ErrorPage />} path='*' />
			</Routes>
		</div>
	)
}

export default App
