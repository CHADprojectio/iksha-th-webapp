import { Route, Routes, useNavigate } from 'react-router-dom'
import MainPage from './pages/mainPage/MainPage'
import CatalogPage from './pages/catalogPage/CatalogPage'
import cart from 'icons/cart.png'
import back from 'icons/back.png'
import CartPage from './pages/cartPage/CartPage'
import { useState } from 'react'
import ErrorPage from './pages/errorPage/ErrorPage'

const App = () => {
	const navigate = useNavigate()
	const [isCartOpen, setIsCartOpen] = useState(false)
	const toggleCartOpen = () => setIsCartOpen(!isCartOpen)

	return (
		<div className='relative'>
			<div className='fixed flex flex-col gap-3 z-[100] right-2 bottom-2'>
				<div
					onClick={toggleCartOpen}
					className='p-2 rounded-full cursor-pointer bg-blue-500 bottom-5 w-[50px] h-[50px] '
				>
					<img src={cart} alt='cart' />
				</div>

				<div
					onClick={() => {
						navigate('/')
					}}
					className='p-2 rounded-full cursor-pointer bg-blue-500 bottom-10 w-[50px] h-[50px] '
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
