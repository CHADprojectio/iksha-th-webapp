import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import notfound from 'public/notfound.jpeg'
interface ITypeCard {
	title: string
	type: string
	img: string
}

// Пример данных для types
const types: ITypeCard[] = [
	{
		title: 'Еда',
		type: 'food',
		img: 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	// { title: 'Услуги', type: 'services', img: 'image2.jpg' },
	// { title: 'Type 3', type: 'type3', img: 'image3.jpg' },
]

const MainPage = () => {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	useEffect(() => {
		if (window.Telegram?.WebApp) {
			const tg = window.Telegram.WebApp
			console.log(tg?.initDataUnsafe?.user?.username)
			if (tg?.initDataUnsafe?.user?.username)
				setName(tg?.initDataUnsafe?.user?.username)
			// You can also initialize or interact with tg here
		} else {
			console.error('Telegram WebApp is not available')
		}
	}, [])

	return (
		<main>
			{name != '' && <div>Привет {name}!</div>}
			<div className='grid w-screen grid-cols-1 gap-4 p-5'>
				{types.map((type, index) => (
					<div
						key={index}
						className='relative text-black z-0 h-[300px] cursor-pointer'
						onClick={() => {
							navigate(`/catalog?type=${type.type}`)
						}}
					>
						<img
							className='object-cover object-center w-full h-full '
							src={type.img || notfound}
							alt={notfound}
						/>
						<div>{type.title}</div>
					</div>
				))}
			</div>
		</main>
	)
}

export default MainPage
