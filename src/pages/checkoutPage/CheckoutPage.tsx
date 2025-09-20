import {Button, IconButton, Input, Section} from '@telegram-apps/telegram-ui'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PickLocation from './components/PickLocation'
import { setCurrentName, setCurrentPhone } from 'store/slices/dataSlice'
import close from 'icons/close.png'
import {useGetLocations} from "../../hooks/useGetLocations.ts";
import DeliveryTimePicker from "./components/DeliveryTimePicker.tsx";
import {useGetCartInfo} from "../../hooks/useGetCartInfo.ts";
interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
	const dispatch = useAppDispatch()
	const currentType = useAppSelector(state => state.data.currentType)
	const cart = useAppSelector(state => state.cart.cart)
	const {data: locations, isLoading: isLocationsLoading} = useGetLocations()
	const {data: cartInfo, isLoading: isCartInfoLoading} = useGetCartInfo()

	const stateName = useAppSelector(state => state.data.name)
	const statePhone = useAppSelector(state => state.data.phone)

	const navigate = useNavigate()
	const [currentLocation, setCurrentLocation] = useState(locations[0])
	const [userId, setUserId] = useState('')
	const [username, setUsername] = useState('')

	useEffect(() => {
		if (!currentLocation) {
			setCurrentLocation(locations[0])
		}
	}, [locations]);

	const [name, setName] = useState(stateName)
	const [phone, setPhone] = useState('')
	const [deliveryTimeFood, setDeliveryTimeFood] =
		useState<string | null>(null)

	const [errors, setErrors] = useState<{
		name?: string
		phone?: string
	}>({})
	const [isConclusionOpen, setIsConclusionOpen] = useState(false)

	useEffect(() => {
		setPhone(statePhone)

		if (window.Telegram?.WebApp) {
			const tg = window.Telegram.WebApp
			const initDataUnsafe = tg.initDataUnsafe || {}
			const userId = initDataUnsafe?.user?.id
			const usernameTg = initDataUnsafe?.user?.username
			const nameTg = initDataUnsafe?.user?.first_name
			const chatId = initDataUnsafe?.chat?.id
			console.log(chatId)
			if (nameTg) {
				setName(nameTg)
			}
			if (usernameTg) {
				setUsername(usernameTg)
			}
			if (userId) {
				setUserId(userId)
			}
		}
	}, [])

	const validate = () => {
		let valid = true
		const errors: {
			name?: string
			phone?: string
		} = {}

		if (!name.trim()) {
			errors.name = 'Имя обязательно'
			valid = false
		}

		const phoneRegex = /^\+7\d{3}\d{3}\d{2}\d{2}$/
		if (!phone.trim()) {
			errors.phone = 'Номер телефона обязателен'
			valid = false
		} else if (!phoneRegex.test(phone)) {
			errors.phone = 'Неверный формат номера телефона'
			valid = false
		}

		setErrors(errors)
		setIsConclusionOpen(false)
		return valid
	}

	const handleSubmit = () => {
		if (validate()) {
			dispatch(setCurrentName(name))
			dispatch(setCurrentPhone(phone))
			setIsConclusionOpen(true)
			console.log('Form is valid, proceed to the next step')
		} else {
			console.log('Form is invalid, please correct the errors')
		}
	}

	const processPayment = async () => {
		const serviceArray: string[] = []
		const foodArray: string[] = []

		cart.forEach(item => {
			if (item.sheetName === 'service') {
				serviceArray.push(`${item.title}-${item.price}-${item.quantity}`)
			} else if (item.sheetName === 'food') {
				foodArray.push(
					`${item.title} ${item.variant}-${item.price}-${item.quantity}`
				)
			}
		})

		const sendCart = cart.map(item => ({
			quantity: item.quantity,
			price: item.price,
			name: item.title + ' ' + item.variant,
		}))

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}payment/pay`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: name.trim(),
					phone: phone.trim(),
					cart: sendCart,
					userId: userId,
					username: username || '',
					time: {
						timeFood: deliveryTimeFood,
					},
					location: currentLocation,
					type: currentType,
					foodArray: foodArray,
					serviceArray: serviceArray,
				}),
			})

			if (res.ok) {
				const contentType = res.headers.get('Content-Type')
				if (contentType && contentType.includes('application/json')) {
					const data = await res.json()
					window.location.href = data.paymentUrl
				} else {
					const paymentUrl = await res.text()
					window.location.href = paymentUrl
				}
			} else {
				const errorData = await res.text()
				console.error('Payment failed:', errorData)
				alert('Payment failed. Please try again.')
			}
		} catch (error) {
			console.error('Error processing payment:', error)
			alert(
				'An error occurred while processing the payment. Please try again.'
			)
		}
	}

	useEffect(() => {
		if (cart.length === 0) navigate('/')
	}, [cart, navigate])

	return (
		<div
			style={{ background: 'var(--tgui--secondary_bg_color)' }}
			className='relative flex flex-col min-h-screen gap-[20px] p-[10px] text-p'
		>
			<div
				onClick={() => {
					navigate('/catalog?type=food')
				}}
				className='fixed top-4 right-4'
			>
				<IconButton
					mode='bezeled'
					size='s'
					className='flex w-[35px] justify-center items-center h-[35px]'
					// style={{ width: '40px', height: '40px' }}
				>
					<img src={close} alt='' />
				</IconButton>
			</div>
			<Section>
				<div className='p-3'>
					<div className='mb-5 font-semibold text-[20px]'>
						Введите свои данные
					</div>
					<form
						onSubmit={e => {
							e.preventDefault()
							handleSubmit()
						}}
					>
						<Input
							header={errors.name ? errors.name : 'Имя'}
							placeholder='Имя'
							value={name}
							onChange={e => setName(e.target.value)}
							status={errors.name ? 'error' : 'default'}
							before={<span>👤</span>}
						/>
						<Input
							header={errors.phone ? errors.phone : 'Номер телефона'}
							placeholder='+7 912 345 67 89'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							status={errors.phone ? 'error' : 'default'}
							before={<span>📞</span>}
						/>

						<PickLocation
							setCurrentLocation={setCurrentLocation}
							currentLocation={currentLocation}
							locations={locations}
							isLoading={isLocationsLoading}
						/>

						{
							cartInfo?.closeTime && cartInfo?.openTime && cartInfo?.deliveryTime ?
								<DeliveryTimePicker setTime={setDeliveryTimeFood} openTime={cartInfo.openTime} closeTime={cartInfo.closeTime} deliveryTime={cartInfo.deliveryTime} /> :
									null
						}


						<Button
							className='w-full'
							type='submit'
							disabled={isLocationsLoading || isCartInfoLoading}
						>
							Дальше
						</Button>
					</form>
				</div>
			</Section>

			{isConclusionOpen && (
				<Section>
					<div className='p-3'>
						<Button
							onClick={async () => {
								await processPayment()
							}}
							className='w-full'
						>
							Оплатить
						</Button>
					</div>
				</Section>
			)}
		</div>
	)
}

export default CheckoutPage
