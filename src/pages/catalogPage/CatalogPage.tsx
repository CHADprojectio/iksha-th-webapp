import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import IDatabaseItem from '../../interfaces/IDatabaseItem'
import ItemDetailsPopup from 'shared/popups/ItemDetailsPopup'
import { Pagination, Spinner, Text } from '@telegram-apps/telegram-ui'
import { useFetch } from 'src/hooks/useFetch'

interface CatalogProps {}

const CatalogPage: React.FC<CatalogProps> = () => {
	const location = useLocation()
	const [currentItem, setCurrentItem] = useState<IDatabaseItem | undefined>(
		undefined
	)
	const [currentPage] = useState(1)
	const queryParams = new URLSearchParams(location.search)
	const type = queryParams.get('type')

	const { data, loading } = useFetch<IDatabaseItem>(type, currentPage)

	// useEffect(() => {
	// 	if (type != undefined) getByType(type).then(res => setItems(res))
	// }, [type])
	// console.log(items)

	const [isItemDetailsPopupOpen, setIsItemDetailsPopup] = useState(false)
	const toggleItemDetailsPopup = () => {
		setIsItemDetailsPopup(!isItemDetailsPopupOpen)
	}

	if (loading)
		return (
			<div className='flex items-center justify-center w-screen h-screen'>
				<Spinner size='l' />
			</div>
		)
	return (
		<div className='relative min-h-[100vh] bg-bg text-p'>
			<ItemDetailsPopup
				isItemDetailsPopupOpen={isItemDetailsPopupOpen}
				toggleItemDetailsPopup={toggleItemDetailsPopup}
				item={currentItem}
			/>
			<div className='relative '>
				<div className=''>
					{type != undefined && data != null ? (
						<div className='grid grid-cols-2 gap-4 p-5'>
							{data.map((item, i) => {
								return (
									<div
										className='w-[40vw] h-[200px] rounded-[40px]'
										onClick={() => {
											setCurrentItem(item)
											toggleItemDetailsPopup()
										}}
										key={i}
									>
										<img
											className='object-cover w-full h-full'
											src={item.photoUrl}
											alt='https://th.bing.com/th/id/OIP.W9-vYFSiy6LSJEHFokqofwHaHa?rs=1&pid=ImgDetMain'
										/>
										<Text>{item.title}</Text>
									</div>
								)
							})}
							<Pagination count={currentPage} />
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	)
}

export default CatalogPage
