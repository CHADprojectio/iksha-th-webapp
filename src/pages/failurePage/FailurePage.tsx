import { LargeTitle, Link } from '@telegram-apps/telegram-ui'

const FailurePage = () => {
	return (
		<div className='flex items-center justify-center w-screen min-h-screen bg-bg'>
			<div className='text-center'>
				<LargeTitle>Что то пошло не так!</LargeTitle>
				<div>
					вы можете повторить заказ или свяжитесь с нашим менеджером!
				</div>
				<Link href='/'>вернуться в каталог</Link>
			</div>
		</div>
	)
}

export default FailurePage
