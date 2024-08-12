import { Button, Input, List } from '@telegram-apps/telegram-ui'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'store/hooks'

interface CheckoutPageProps {
	toggleCartOpen: () => void
}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
	const cart = useAppSelector(state => state.cart.cart)
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
	const [isDisabled] = useState<boolean>(false)

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
			console.log('Form is valid, proceed to the next step')
			// Add logic to move to the next step or submit the form
		} else {
			console.log('Form is invalid, please correct the errors')
		}
	}

	useEffect(() => {
		if (cart.length === 0) navigate('/')
	}, [cart])

	return (
		<div className='relative p-5 text-p bg-bg'>
			<div className='mb-5 font-semibold text-[20px]'>
				Введите свои данные
			</div>
			<List>
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
					onClick={handleSubmit}
					disabled={isDisabled}
				>
					Дальше
				</Button>
			</List>
		</div>
	)
}

export default CheckoutPage
