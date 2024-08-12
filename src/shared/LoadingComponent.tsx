import { Spinner } from '@telegram-apps/telegram-ui'

const LoadingComponent = () => {
	return (
		<div className='flex items-center justify-center w-screen h-screen'>
			<Spinner size='l' />
		</div>
	)
}

export default LoadingComponent
