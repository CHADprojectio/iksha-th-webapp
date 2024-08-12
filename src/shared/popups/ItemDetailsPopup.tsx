import {
	Button,
	IconButton,
	IconContainer,
	LargeTitle,
	Subheadline,
	Text,
} from '@telegram-apps/telegram-ui'
import IDatabaseItem from 'interfaces/IDatabaseItem'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
	addItemToCart,
	incrementQuantity,
	decrementQuantity, // Import decrement action
	removeFromCart,
} from 'store/slices/cartSlice'
import close from 'icons/close.png'
import plus from 'icons/plus.png'
import minus from 'icons/minus.png'

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
			<div className='w-[90vw] overflow-y-scroll rounded-md p-5 text-p bg-bg h-[90vh] shadow-2xl'>
				<div className='flex items-center justify-between'>
					<LargeTitle weight='2' className='font-semibold '>
						{item.title}
					</LargeTitle>

					<IconButton
						mode='bezeled'
						size='s'
						className='flex w-[30px] justify-center items-center h-[30px]'
						// style={{ width: '40px', height: '40px' }}
						onClick={toggleItemDetailsPopup}
					>
						<img src={close} alt='' />
					</IconButton>
				</div>
				<Text className='flex gap-1 mb-3'>
					{item.price}р
					{item.paymentDescription && <div>{item.paymentDescription}</div>}
				</Text>

				<img className='rounded-lg' src={item.photoUrl} alt={item.title} />
				<Subheadline className='mt-2 mb-4 font-light'>
					{item.description}
				</Subheadline>
				<div className='flex justify-between mt-3'>
					<Button onClick={handleCartButtonClick}>
						{isItemInCart ? 'удалить из корзины' : 'добавить в корзину'}
					</Button>
					<IconContainer></IconContainer>
					{item.isStackable && isItemInCart && (
						<div className='flex items-center'>
							<IconButton
								size='s'
								className='px-4 py-2 w-[35px] h-[35px] rounded-full text-h1 bg-button '
								onClick={handleDecrement}
							>
								<img src={minus} alt='' />
							</IconButton>
							<div className='mx-2'>{isItemInCartCheck?.quantity}</div>
							<IconButton
								size='s'
								className='px-4 py-2 rounded-full w-[35px] h-[35px] text-h1 bg-button '
								onClick={handleIncrement}
							>
								<img src={plus} alt='' />
							</IconButton>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ItemDetailsPopup
{
	/* <Input
							type='number'
							
							header='Кол-во'
							value={isItemInCartCheck?.quantity}
							onChange={e => {
								dispatch(
									changeQuantity({
										newQuantity: Number(e.target.value),
										title: isItemInCartCheck?.title,
									})
								)
							}}
						/> */
}
