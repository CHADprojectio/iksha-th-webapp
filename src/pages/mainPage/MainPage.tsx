import { Card } from '@telegram-apps/telegram-ui'
import { CardCell } from '@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell'
import { useNavigate } from 'react-router-dom'

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
	{ title: 'Услуги', type: 'services', img: 'image2.jpg' },
	{ title: 'Type 3', type: 'type3', img: 'image3.jpg' },
]

const MainPage = () => {
	const navigate = useNavigate()

	return (
		<main>
			<div className='grid w-screen grid-cols-1 gap-4 p-5'>
				{types.map((type, index) => (
					<Card
						key={index}
						className='relative h-[300px] cursor-pointer'
						onClick={() => {
							navigate(`/catalog?type=${type.type}`)
						}}
					>
						<img
							className='z-0 object-cover object-center w-full h-full'
							src={type.img}
							alt={type.title}
						/>
						<CardCell className='absolute z-10 text-white'>
							{type.title}
						</CardCell>
					</Card>
				))}
			</div>
		</main>
	)
}

export default MainPage
