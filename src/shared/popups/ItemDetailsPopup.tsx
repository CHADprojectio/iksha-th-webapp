import {
	Button,
	Headline,
	IconButton,
	IconContainer,
	Subheadline,
	Text,
} from '@telegram-apps/telegram-ui'
import IDatabaseItem from 'interfaces/IDatabaseItem'
import React, { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
	addItemToCart,
	incrementQuantity,
	decrementQuantity,
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

	// const currentPrice = useState<number>(item?.price || -1)
	// const variants = item?.variants || []
	// const priceVariants = item?.priceVariants || []

	// useEffect(() => {}, [])

	const isItemInCart = useMemo(
		() => !!cart.find(cartItem => cartItem.title === item?.title),
		[cart, item?.title]
	)

	const handleCartButtonClick = () => {
		if (item) {
			if (isItemInCart) {
				dispatch(removeFromCart({ title: item.title }))
			} else {
				dispatch(addItemToCart(item))
			}
		}
	}

	const handleQuantityChange = (action: 'increment' | 'decrement') => {
		if (item) {
			if (action === 'increment') {
				dispatch(incrementQuantity({ title: item.title }))
			} else {
				dispatch(decrementQuantity({ title: item.title }))
			}
		}
	}

	if (!item || !isItemDetailsPopupOpen) return null

	const cartItem = cart.find(cartItem => cartItem.title === item.title)

	return (
		<div className='flex items-center justify-center popup_bg'>
			<div className='w-[90vw] overflow-y-scroll rounded-md p-5 text-p bg-bg h-[90vh] shadow-2xl'>
				<div className='flex items-start justify-between'>
					<Headline weight='2' className='font-semibold'>
						{item.title}
					</Headline>
					<IconButton
						mode='bezeled'
						size='s'
						className='flex w-[40px] justify-center items-center h-[40px]'
						onClick={toggleItemDetailsPopup}
					>
						<img src={close} alt='Close' />
					</IconButton>
				</div>
				<Text className='flex gap-1 mb-3'>
					{item.price}р
					{item.paymentDescription && <div>{item.paymentDescription}</div>}
				</Text>
				<img
					className='w-full mt-4 rounded-lg'
					src={item.photoUrl}
					alt={item.title}
				/>
				<Subheadline className='mt-2 mb-4 font-light'>
					{item.description}
				</Subheadline>
				<div className='flex justify-between mt-3'>
					<Button onClick={handleCartButtonClick}>
						{isItemInCart ? 'удалить из корзины' : 'добавить в корзину'}
					</Button>
					<IconContainer />
					{item.isStackable && isItemInCart && (
						<div className='flex items-center'>
							<IconButton
								size='s'
								className='px-4 py-2 w-[35px] h-[35px] rounded-full text-h1 bg-button'
								onClick={() => handleQuantityChange('decrement')}
							>
								<img src={minus} alt='Decrement' />
							</IconButton>
							<div className='mx-2'>{cartItem?.quantity}</div>
							<IconButton
								size='s'
								className='px-4 py-2 rounded-full w-[35px] h-[35px] text-h1 bg-button'
								onClick={() => handleQuantityChange('increment')}
							>
								<img src={plus} alt='Increment' />
							</IconButton>
						</div>
					)}
				</div>
				{/* {variants.length > 0 && (
					<div>
						<Select header=''>
							{variants.map((varItem, i) => (
								<option key={i}>{varItem}</option>
							))}
						</Select>
					</div>
				)} */}
			</div>
		</div>
	)
}

export default ItemDetailsPopup
