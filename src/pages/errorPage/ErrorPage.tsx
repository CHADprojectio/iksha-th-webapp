import { Button } from '@telegram-apps/telegram-ui'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
	const navigate = useNavigate()
	return (
		<div className='flex items-center justify-center w-screen h-screen bg-bg'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<h1 className='text-center text-[30px] font-semibold text-h1'>
					Этой страницы не существует
				</h1>
				<Button
					onClick={() => {
						navigate('/')
					}}
				>
					Вернуться на главную
				</Button>
			</div>
		</div>
	)
}

export default ErrorPage
