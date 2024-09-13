import { Button, Input, Section } from '@telegram-apps/telegram-ui'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PickLocation from './components/PickLocation'
import { setCurrentName, setCurrentPhone } from 'store/slices/dataSlice'

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
	// const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState(false)
	const dispatch = useAppDispatch()
	const currentType = useAppSelector(state => state.data.currentType)
	const cart = useAppSelector(state => state.cart.cart)

	const stateName = useAppSelector(state => state.data.name)
	const statePhone = useAppSelector(state => state.data.phone)

	const navigate = useNavigate()
	const [locations] = useState([
		'Лесная резиденция',
		'Вилла Делюкс',
		'Дуплекс',
		'Домик Коралловый',
		'Домик Лесной',
		'Домик Морской',
		'Шале',
	])
	const [currentLocation, setCurrentLocation] = useState(locations[0])
	// const [chatId, setChatId] = useState('')
	const [userId, setUserId] = useState('')
	const [username, setUsername] = useState('')

	const [name, setName] = useState(stateName)
	const [phone, setPhone] = useState(statePhone)
	const [deliveryTime, setDeliveryTime] = useState<string>('Как можно скорее')

	const [errors, setErrors] = useState<{
		name?: string
		phone?: string
		deliveryTime?: string
	}>({})
	const [isDisabled] = useState<boolean>(false)
	const [isConclusionOpen, setIsConclusionOpen] = useState(false)

	useEffect(() => {
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
			if (chatId) {
				// setChatId(chatId)
			}
		}
	}, [])

	const validate = () => {
		let valid = true
		const errors: { name?: string; phone?: string; deliveryTime?: string } =
			{}

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

		if (!deliveryTime.trim()) {
			errors.deliveryTime = 'Время доставки обязательно'
			valid = false
		}

		setErrors(errors)
		setIsConclusionOpen(false)
		return valid
	}

	const handleSubmit = () => {
		if (validate()) {
			// Proceed to the next step if valid
			dispatch(setCurrentName(name))
			dispatch(setCurrentPhone(phone))
			setIsConclusionOpen(true)
			console.log('Form is valid, proceed to the next step')
			// Add logic to move to the next step or submit the form
		} else {
			console.log('Form is invalid, please correct the errors')
		}
	}
	const redirect = (link: string) => {
		window.location.replace(link)
	}

	interface ISendCartItem {
		quantity: number
		name: string
		price: number
	}

	const processPayment = async () => {
		const serviceArray: string[] = []
		const foodArray: string[] = []

		cart.forEach(item => {
			if (item.type === 'service') {
				serviceArray.push(`${item.title}-${item.price}-${item.quantity}`)
			} else if (item.type === 'food') {
				foodArray.push(
					`${item.title} ${item.variant}-${item.price}-${item.quantity}`
				)
			}
		})

		const sendCart: ISendCartItem[] = cart.map(item => ({
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
					time: deliveryTime,
					location: currentLocation,
					type: currentType,
					foodArray: foodArray,
					serviceArray: serviceArray,
				}),
			})

			if (res.ok) {
				const contentType = res.headers.get('Content-Type')
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					const data = await res.json()
					redirect(data.paymentUrl) // Adjust this if your JSON structure is different
				} else {
					// If the response is plain text, treat it as a URL
					const paymentUrl = await res.text()
					redirect(paymentUrl)
				}
			} else {
				// Handle non-200 responses
				const errorData = await res.text() // Assuming error messages could also be plain text
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
						{/* <div className='flex flex-col gap-2'>
							<Text>Your chatId: {chatId}</Text>
							<Text>Your userId: {userId}</Text>
							<Text>Your username: {username}</Text>
						</div> */}
						<Input
							header={errors.name ? errors.name : 'Имя'}
							placeholder='Имя'
							value={name}
							onChange={e => setName(e.target.value)}
							status={errors.name ? 'error' : 'default'} // Visual state
							before={<span>👤</span>} // Icon before inpu
						/>
						<Input
							header={errors.phone ? errors.phone : 'Номер телефона'}
							placeholder='+7 912 345 67 89'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							status={errors.phone ? 'error' : 'default'} // Visual state
							before={<span>📞</span>} // Icon before input
						/>
						<PickLocation
							setCurrentLocation={setCurrentLocation}
							currentLocation={currentLocation}
							locations={locations}
						/>
						<Input
							header={
								errors.deliveryTime
									? errors.deliveryTime
									: 'Время доставки'
							}
							placeholder='сегодня в 15:30'
							value={deliveryTime}
							className=''
							onChange={e => setDeliveryTime(e.target.value)}
							status={errors.deliveryTime ? 'error' : 'default'}
							before={<span>⏰</span>}
							disabled={isDisabled}
						/>
						<Button
							className='w-full'
							type='submit'
							disabled={isDisabled}
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
							// disabled={isPaymentButtonDisabled}
							onClick={async () => {
								// setIsPaymentButtonDisabled(true)
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
