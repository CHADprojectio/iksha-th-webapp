import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getByType } from '../../firebase/firebase'
import IDatabaseItem from '../../interfaces/IDatabaseItem'
import ItemDetailsPopup from 'shared/popups/ItemDetailsPopup'

interface CatalogProps {}

const CatalogPage: React.FC<CatalogProps> = () => {
	const location = useLocation()
	const [items, setItems] = useState<IDatabaseItem[]>([])
	const [currentItem, setCurrentItem] = useState<IDatabaseItem | undefined>(
		undefined
	)
	const queryParams = new URLSearchParams(location.search)
	const type = queryParams.get('type')

	useEffect(() => {
		if (type != undefined) getByType(type).then(res => setItems(res))
	}, [type])
	console.log(items)

	const [isItemDetailsPopupOpen, setIsItemDetailsPopup] = useState(false)
	const toggleItemDetailsPopup = () => {
		setIsItemDetailsPopup(!isItemDetailsPopupOpen)
	}

	return (
		<main className='relative'>
			<ItemDetailsPopup
				isItemDetailsPopupOpen={isItemDetailsPopupOpen}
				toggleItemDetailsPopup={toggleItemDetailsPopup}
				item={currentItem}
			/>
			<div className='relative text-black'>
				<div className=''>
					{type != undefined ? (
						<div className='grid grid-cols-2 gap-4 p-5'>
							{items.map((item, i) => {
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
										<div>{item.title}</div>
									</div>
								)
							})}
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</main>
	)
}

export default CatalogPage
