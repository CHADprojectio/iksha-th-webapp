import { LargeTitle, Link } from '@telegram-apps/telegram-ui'

const SuccessPage = () => {
	return (
		<div className='flex items-center justify-center w-screen min-h-screen bg-bg'>
			<div className='text-center'>
				<LargeTitle>Спасибо за заказ!</LargeTitle>
				<div>наш менеджер скоро свяжется с вами!</div>
				<Link href='/'>вернуться в каталог</Link>
			</div>
		</div>
	)
}

export default SuccessPage
