import { Button, Input, Section } from '@telegram-apps/telegram-ui'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'store/hooks'

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
	const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState(false)
	const cart = useAppSelector(state => state.cart.cart)
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
	const [isDisabled] = useState<boolean>(false)

	const [isConclusionOpen, setIsConclusionOpen] = useState(false)

	const validate = () => {
		let valid = true
		const errors: { name?: string; phone?: string } = {}

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
		return valid
	}

	const handleSubmit = () => {
		if (validate()) {
			// Proceed to the next step if valid
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
						<Input
							header={errors.name ? errors.name : 'Имя'}
							placeholder='Имя'
							value={name}
							onChange={e => setName(e.target.value)}
							status={errors.name ? 'error' : 'default'} // Visual state
							before={<span>👤</span>} // Icon before inpu
							disabled={isDisabled} // Disable if needed
						/>
						<Input
							header={errors.phone ? errors.phone : 'Номер телефона'}
							placeholder='пример:+7 912 345 67 89'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							status={errors.phone ? 'error' : 'default'} // Visual state
							before={<span>📞</span>} // Icon before input
							disabled={isDisabled} // Disable if needed
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
							disabled={isPaymentButtonDisabled}
							onClick={async () => {
								setIsPaymentButtonDisabled(true)
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
