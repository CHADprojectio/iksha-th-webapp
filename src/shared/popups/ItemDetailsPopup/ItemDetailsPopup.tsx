import {
	Button,
	Headline,
	IconButton,
	Select,
	Subheadline,
	Text,
} from '@telegram-apps/telegram-ui'
import IDatabaseItem from 'interfaces/IDatabaseItem'
import React, { useMemo, useState, useEffect } from 'react'
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
	const [variants, setVariants] = useState<string[]>([])
	const [priceVariants, setPriceVariants] = useState<number[]>([])
	const [currentVariant, setCurrentVariant] = useState(variants[0] || '')
	const [currentPrice, setCurrentPrice] = useState<number | undefined>(
		item?.price
	)

	useEffect(() => {
		if (priceVariants.length > 0) setCurrentPrice(priceVariants[0])
		setVariants(item?.variants || [])
		setPriceVariants(item?.priceVariants || [])
	}, [item])

	useEffect(() => {
		// Update the price when the variant changes
		if (variants.length > 0 && priceVariants.length > 0) {
			const variantIndex = variants.indexOf(currentVariant)
			if (variantIndex !== -1 && priceVariants[variantIndex] !== undefined) {
				setCurrentPrice(priceVariants[variantIndex])
			} else {
				setCurrentPrice(item?.price ?? 0)
			}
		}
	}, [currentVariant, variants, priceVariants, item?.price])

	const isItemInCart = useMemo(
		() =>
			!!cart.find(
				cartItem =>
					cartItem.title === item?.title &&
					cartItem.variant === currentVariant
			),
		[cart, item?.title, currentVariant]
	)

	const handleCartButtonClick = () => {
		if (item) {
			if (isItemInCart) {
				dispatch(removeFromCart({ title: item.title }))
			} else {
				dispatch(
					addItemToCart({
						title: item.title,
						price: currentPrice || item.price,
						quantity: 1,
						variant: currentVariant,
					})
				)
			}
		}
	}

	const handleQuantityChange = (action: 'increment' | 'decrement') => {
		if (item) {
			const payload = { title: item.title, variant: currentVariant }
			if (action === 'increment') {
				dispatch(incrementQuantity(payload))
			} else {
				dispatch(decrementQuantity(payload))
			}
		}
	}

	if (!item || !isItemDetailsPopupOpen) return null

	const cartItem = cart.find(
		cartItem =>
			cartItem.title === item.title && cartItem.variant === currentVariant
	)

	return (
		<div className='flex items-center justify-center popup_bg'>
			<div className='w-screen h-screen overflow-y-scroll rounded-md p-5 text-p bg-bg shadow-2xl'>
				<div className='flex items-start justify-between'>
					<IconButton
						mode='bezeled'
						size='s'
						className='flex w-[40px] justify-center items-center h-[40px]'
						onClick={toggleItemDetailsPopup}
					>
						<img src={close} alt='Close' />
					</IconButton>
				</div>
				<img
					className='w-full mt-4 rounded-lg'
					src={item.photoUrl}
					alt={item.title}
				/>
				<Headline weight='2' className='font-semibold'>
					{item.title}
				</Headline>
				<Text className='flex gap-1 mb-3'>
					{currentPrice}р
					{item.paymentDescription && <div>{item.paymentDescription}</div>}
				</Text>
				<Subheadline className='mt-2 mb-4 font-light'>
					{item.description}
				</Subheadline>
				{variants.length > 0 && (
					<div className='select_container mt-4'>
						<Select
							style={{ height: '30px', margin: '0px', padding: '4px' }}
							value={currentVariant}
							onChange={e => setCurrentVariant(e.target.value)}
						>
							{variants.map((variant, i) => (
								<option key={i} value={variant}>
									{variant}
								</option>
							))}
						</Select>
					</div>
				)}

				<div className='flex justify-between mt-3'>
					<Button onClick={handleCartButtonClick}>
						{isItemInCart ? 'удалить из корзины' : 'добавить в корзину'}
					</Button>
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
			</div>
		</div>
	)
}

export default ItemDetailsPopup
