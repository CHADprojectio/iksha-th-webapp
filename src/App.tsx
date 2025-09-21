import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom'

import cart from 'icons/cart.png'
import CartPage from './pages/cartPage/CartPage'
import { useEffect, useState } from 'react'
import {IconButton, Tabbar} from '@telegram-apps/telegram-ui'
import CatalogPage from './pages/catalogPage/CatalogPage'
import SuccessPage from './pages/successPage/SuccessPage'
import CheckoutPage from './pages/checkoutPage/CheckoutPage'
import FailurePage from './pages/failurePage/FailurePage'
import ErrorPage from './pages/errorPage/ErrorPage'
import FoodPage from './pages/foodPage/FoodPage'
import { TabsItem } from '@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem'
import {useAppSelector} from "store/hooks.ts";
import {getCartTotalQuantity} from "./helpers/get-cart-total-quantity.ts";

const App = () => {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const toggleCartOpen = () => setIsCartOpen(!isCartOpen)
	const cartData = useAppSelector(state => state.cart.cart)
	const [theme, setTheme] = useState<'dark' | 'light'>('dark')

	const location = useLocation()
	const queryParams = new URLSearchParams(location.search)
	const type = queryParams.get('type')

	const navigate = useNavigate()
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
			<div className='fixed bottom-0 w-screen h-[40px] z-50'>
				<Tabbar>
					<TabsItem onClick={() => navigate('/catalog?type=food')} selected={type === 'food'}>
						Еда
					</TabsItem>
					<TabsItem onClick={() => navigate('/catalog?type=service')} selected={type === 'service'}>
						Услуги
					</TabsItem>
				</Tabbar>
			</div>

			<div className='fixed flex flex-col gap-3 z-[10] right-2 bottom-[70px]'>
				<IconButton
					onClick={toggleCartOpen}
					className='w-[50px] rounded-full h-[50px] '
					mode='bezeled'
					size='l'
				>
					{/* className='p-2 rounded-full cursor-pointer bg-button bottom-5 */}

					<img src={cart} alt='cart' />
					{
						!!cartData.length && <div className={"absolute  -right-1 -top-3 w-5 h-5 rounded-full text-sm bg-blue-500 flex items-center justify-center text-black font-bold"}>{getCartTotalQuantity(cartData)}</div>
					}
				</IconButton>
			</div>
			{isCartOpen && <CartPage toggleCartOpen={toggleCartOpen} />}
			<Routes>
				<Route path="/" element={<Navigate to="/catalog?type=food" replace />} />
				<Route element={<CatalogPage />} path='/catalog' />
				{/* <Route element={<CatalogPage />} path='/catalog/service' /> */}
				{/* <Route element={<CatalogPage />} path='/catalog/food' /> */}
				<Route element={<CheckoutPage />} path='/checkout' />
				<Route element={<SuccessPage />} path='/success' />
				<Route element={<FailurePage />} path='/failure' />
				<Route element={<FoodPage />} path='/food' />
				<Route element={<ErrorPage />} path='*' />
			</Routes>
		</div>
	)
}

export default App
