import { Button, IconButton } from '@telegram-apps/telegram-ui'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { removeFromCart } from 'store/slices/cartSlice'
import close from 'icons/close.png'
import { useNavigate } from 'react-router-dom'

interface CartPageProps {
	toggleCartOpen: () => void
}

const CartPage: React.FC<CartPageProps> = ({ toggleCartOpen }) => {
	const cart = useAppSelector(state => state.cart.cart)

	const summary = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	return (
		<div className='fixed inset-0 z-10 w-screen h-screen p-2 text-p bg-bg'>
			<h1 className='text-[25px] text-h1 mb-4'>Корзина</h1>
			{cart.length == 0 ? (
				<div>В корзине пусто....</div>
			) : (
				<div className='flex flex-col'>
					<div className='mb-[30px] flex flex-col gap-3'>
						{cart.map((item, i) => {
							return (
								<div
									className={`flex gap-4 items-center text-p text-[20px]`}
									key={i}
								>
									<IconButton
										mode='bezeled'
										size='s'
										className='flex w-[30px] justify-center items-center h-[30px]'
										// style={{ width: '40px', height: '40px' }}
										onClick={() => {
											dispatch(
												removeFromCart({
													variant: item.variant,
													title: item.title,
												})
											)
										}}
									>
										<img src={close} alt='' />
									</IconButton>
									<div>
										{item.title} {item.variant}
									</div>
									<div className='text-[15px]'>x{item.quantity}</div>
									<div className='text-[15px]'>{item.price}р</div>
								</div>
							)
						})}
					</div>
					<div></div>
					<Button
						onClick={() => {
							navigate('/checkout')
							toggleCartOpen()
						}}
					>
						Оплатить {summary}р
					</Button>
				</div>
			)}{' '}
		</div>
	)
}

export default CartPage
