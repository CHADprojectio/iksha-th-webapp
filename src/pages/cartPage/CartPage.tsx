import React from 'react'
import { useAppSelector } from 'store/hooks'

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = () => {
	const cart = useAppSelector(state => state.cart.cart)

	return (
		<div className='fixed inset-0 z-10 w-screen h-screen p-2 text-black bg-white'>
			<h1 className='text-[25px]'>Корзина</h1>
			{cart.length == 0 ? (
				<div>В корзине пусто....</div>
			) : (
				<div className='flex flex-col'>
					{cart.map((item, i) => {
						return (
							<div className={``} key={i}>
								<div>{item.title}</div>
							</div>
						)
					})}
				</div>
			)}{' '}
		</div>
	)
}

export default CartPage
