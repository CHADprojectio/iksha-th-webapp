import React, { useMemo, useState, useEffect } from 'react'
import {
	Button,
	Headline,
	IconButton,
	Select,
	Subheadline,
	Text,
} from '@telegram-apps/telegram-ui'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
	addItemToCart,
	incrementQuantity,
	decrementQuantity,
	removeFromCart,
} from 'store/slices/cartSlice'
import IDatabaseItem from 'interfaces/IDatabaseItem'
import close from 'icons/close.png'
import ImageComponent from 'shared/ImageComponent'
import getPhotoUrl from 'src/helpers/GetPhotoUrl'
import SelectQuantity from "../../../components/SelectQuantity.tsx";

// Добавлен тип для action в handleQuantityChange
type QuantityAction = 'increment' | 'decrement'

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
	const [currentVariant, setCurrentVariant] = useState<string>('')
	const [currentPrice, setCurrentPrice] = useState<number | undefined>(
		item?.price
	)

	useEffect(() => {
		if (item) {
			const itemVariants = item.variants || []
			const itemPriceVariants = item.priceVariants || []
			setVariants(itemVariants)
			setPriceVariants(itemPriceVariants)

			if (itemVariants.length > 0 && itemPriceVariants.length > 0) {
				setCurrentVariant(itemVariants[0])
				setCurrentPrice(itemPriceVariants[0])
			} else {
				setCurrentPrice(item.price)
			}
		}
	}, [item])

	useEffect(() => {
		if (variants.length > 0 && priceVariants.length > 0) {
			const variantIndex = variants.indexOf(currentVariant)
			if (variantIndex !== -1 && priceVariants[variantIndex] !== undefined) {
				setCurrentPrice(priceVariants[variantIndex])
			} else {
				setCurrentPrice(item?.price ?? 0)
			}
		}
	}, [currentVariant, variants, priceVariants, item?.price])

	const itemFromCard = useMemo(() =>
		cart.find(c => c.title === item?.title &&
			c.variant === currentVariant), [cart, item?.title, currentVariant])

	const handleCartButtonClick = () => {
		if (!item) {
			return;
		}

		if (itemFromCard) {
			dispatch(
				removeFromCart({ title: item.title, variant: currentVariant })
			)
		} else {
			dispatch(
				addItemToCart({
					type: item.type,
					photoUrl: getPhotoUrl(item?.photoUrl),
					title: item.title,
					price: currentPrice ?? item.price,
					quantity: 1,
					variant: currentVariant,
				})
			)
		}
	}

	const handleQuantityChange = (action: QuantityAction) => {
		if (item) {
			const payload = { title: item.title, variant: currentVariant }
			if (action === 'increment') {
				dispatch(incrementQuantity(payload))
			} else {
				if (itemFromCard && itemFromCard.quantity > 1) {
					dispatch(decrementQuantity(payload))
				} else {
					dispatch(removeFromCart(payload))
				}
			}
		}
	}

	if (!item || !isItemDetailsPopupOpen) return null

	return (
		<div className='flex items-center justify-center'>
			<div
				style={{
					backgroundColor: 'var(--tgui--secondary_bg_color)',
				}}
				className='overflow-y-scroll p-5 text-p z-[100] popup_bg bg-bg'
			>
				<div className='flex items-start justify-between'>
					<IconButton
						mode='bezeled'
						size='s'
						className='flex w-[40px] justify-center items-center h-[40px]'
						onClick={() => {
							setCurrentPrice(0)
							setVariants([])
							toggleItemDetailsPopup()
						}}
					>
						<img src={close} alt='Close' />
					</IconButton>
				</div>
				<ImageComponent
					className='w-full mt-4 rounded-lg'
					src={getPhotoUrl(item?.photoUrl)}
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
					<div className='mt-4 select_container'>
						<Select
							className='h-[30px] m-0 p-1'
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
					{
						!itemFromCard ? (<Button onClick={handleCartButtonClick}>
							добавить в корзину
						</Button>) : (
							<SelectQuantity quantity={itemFromCard.quantity} handleQuantityChange={handleQuantityChange} size={"l"} />
						)
					}

					{/*{item.isStackable && isItemInCart && (*/}
					{/*	<div className='flex items-center'>*/}
					{/*		<IconButton*/}
					{/*			size='s'*/}
					{/*			className='px-4 py-2 w-[35px] h-[35px] rounded-full text-h1 bg-button'*/}
					{/*			onClick={() => handleQuantityChange('decrement')}*/}
					{/*		>*/}
					{/*			<img src={minus} alt='Decrement' />*/}
					{/*		</IconButton>*/}
					{/*		<div className='mx-2'>{cartItem?.quantity}</div>*/}
					{/*		<IconButton*/}
					{/*			size='s'*/}
					{/*			className='px-4 py-2 rounded-full w-[35px] h-[35px] text-h1 bg-button'*/}
					{/*			onClick={() => handleQuantityChange('increment')}*/}
					{/*		>*/}
					{/*			<img src={plus} alt='Increment' />*/}
					{/*		</IconButton>*/}
					{/*	</div>*/}
					{/*)}*/}
				</div>
			</div>
		</div>
	)
}

export default ItemDetailsPopup
