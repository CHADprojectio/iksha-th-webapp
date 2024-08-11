import { Button, IconButton } from '@telegram-apps/telegram-ui'
import IDatabaseItem from 'interfaces/IDatabaseItem'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
	addItemToCart,
	incrementQuantity,
	decrementQuantity, // Import decrement action
	removeFromCart,
} from 'store/slices/cartSlice'

interface ItemDetailsPopupProps {
	item: IDatabaseItem | undefined
	toggleItemDetailsPopup: () => void
	isItemDetailsPopupOpen: boolean
}

const ItemDetailsPopup: React.FC<ItemDetailsPopupProps> = ({
	item,
	toggleItemDetailsPopup,
	isItemDetailsPopupOpen,
}) => {
	const cart = useAppSelector(state => state.cart.cart)
	const dispatch = useAppDispatch()

	const isItemInCartCheck = cart.find(
		cartItem => cartItem.title === item?.title
	)

	const [isItemInCart, setIsItemInCart] = useState<boolean>(
		!!isItemInCartCheck
	)

	useEffect(() => {
		setIsItemInCart(!!isItemInCartCheck)
	}, [isItemInCartCheck])

	const handleCartButtonClick = () => {
		if (item) {
			if (isItemInCart) {
				dispatch(removeFromCart({ title: item.title }))
			} else {
				dispatch(addItemToCart(item))
			}
			setIsItemInCart(!isItemInCart)
		}
	}

	const handleIncrement = () => {
		if (item) {
			dispatch(incrementQuantity({ title: item.title }))
		}
	}

	const handleDecrement = () => {
		if (item) {
			dispatch(decrementQuantity({ title: item.title }))
		}
	}

	if (!item || !isItemDetailsPopupOpen) return null

	return (
		<div className='flex items-center justify-center popup_bg'>
			<div className='w-[90vw] overflow-y-scroll rounded-md p-5 text-black bg-[#fafafa] h-[90vh] shadow-2xl'>
				<div className='flex items-center justify-between'>
					<h2 className='font-semibold text-[25px]'>{item.title}</h2>
					<IconButton
						mode='plain'
						size='s'
						onClick={toggleItemDetailsPopup}
					>
						close
					</IconButton>
				</div>
				<div className='flex gap-2'>
					<div>{item.price}</div>
					{item.paymentDescription && <div>{item.paymentDescription}</div>}
				</div>

				<img className='rounded-lg' src={item.photoUrl} alt={item.title} />
				<div className='mt-4 font-light text-slate-600'>
					{item.description}
				</div>
				<div className='flex justify-between'>
					<Button onClick={handleCartButtonClick}>
						{isItemInCart ? 'удалить из корзины' : 'добавить в корзину'}
					</Button>

					{item.isStackable && isItemInCart && (
						<div className='flex items-center'>
							<Button onClick={handleDecrement}>-</Button>
							<div className='mx-2'>{isItemInCartCheck?.quantity}</div>
							<Button onClick={handleIncrement}>+</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ItemDetailsPopup
