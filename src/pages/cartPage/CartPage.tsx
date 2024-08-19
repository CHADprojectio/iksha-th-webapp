import { Button, Divider } from '@telegram-apps/telegram-ui'
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
		<div
			style={{ background: 'var(--tgui--secondary_bg_color)' }}
			className='popup_bg z-[1000] p-2 text-p bg-bg'
		>
			<div className='flex justify-between'>
				<h1 className='text-[25px] text-h1 mb-4'>Корзина</h1>

				<div
					// mode='bezeled'
					// size='s'
					className='flex w-[30px] justify-center items-center h-[30px]'
					// style={{ width: '40px', height: '40px' }}
					onClick={() => {
						toggleCartOpen()
					}}
				>
					<img src={close} alt='' />
				</div>
			</div>
			{cart.length == 0 ? (
				<div>В корзине пусто....</div>
			) : (
				<div className='flex flex-col'>
					<div className='mb-[30px] '>
						<div className='overflow-y-scroll flex flex-col gap-[30px] h-[70vh]'>
							{cart.map((item, i) => {
								return (
									<div
										className={`gap-4 items-center text-p text-[20px]`}
										key={i}
									>
										<div className='flex mb-3'>
											<img
												className='h-[64px] w-[64px]'
												src={item.photoUrl}
												alt={item.title}
											/>
											<div className='flex flex-col w-full'>
												<div className='flex justify-between items-center'>
													<h2>{item.title}</h2>
													<div
														// mode='bezeled'
														// size='s'
														className='flex w-[20px] justify-center items-center h-[30px]'
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
													</div>
												</div>
												<div className='text-[12px]'>
													{item.variant}
												</div>
											</div>
										</div>
										<Divider />
										<div className='text-[15px]'>{item.price}р</div>
									</div>
								)
							})}
						</div>
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
