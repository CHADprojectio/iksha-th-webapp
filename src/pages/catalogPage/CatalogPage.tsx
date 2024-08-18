import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import IDatabaseItem from '../../interfaces/IDatabaseItem'
import ItemDetailsPopup from 'shared/popups/ItemDetailsPopup'
import { Pagination, Section, Text } from '@telegram-apps/telegram-ui'
import { useDatabaseItemsFetch } from 'src/hooks/useDatabaseItemsFetch'
import LoadingComponent from 'shared/LoadingComponent'

interface CatalogProps {}

const CatalogPage: React.FC<CatalogProps> = () => {
	const location = useLocation()
	const [currentItem, setCurrentItem] = useState<IDatabaseItem | undefined>(
		undefined
	)
	const [currentPage, setCurrentPage] = useState(1)
	const queryParams = new URLSearchParams(location.search)
	const type = queryParams.get('type')

	const { data, loading, error, pages } = useDatabaseItemsFetch<IDatabaseItem>(
		type,
		currentPage
	)

	const [isItemDetailsPopupOpen, setIsItemDetailsPopup] = useState(false)
	const toggleItemDetailsPopup = () => {
		setIsItemDetailsPopup(!isItemDetailsPopupOpen)
	}

	if (loading) return <LoadingComponent />
	if (error) {
		return (
			<div>
				Произошла какая то ошибка, перезагрузите сайт или прейдите позже
			</div>
		)
	}
	return (
		<div className='relative min-h-[100vh] bg-bg p-1 text-p'>
			<ItemDetailsPopup
				isItemDetailsPopupOpen={isItemDetailsPopupOpen}
				toggleItemDetailsPopup={toggleItemDetailsPopup}
				item={currentItem}
			/>
			<Section>
				<div className='relative p-5 '>
					<div className='text-[40px] text-h1 mb-5'>
						{type == 'food' ? 'Еда' : 'Услуги'}
					</div>
					<div className=''>
						{type != undefined && data != null ? (
							<div>
								<div className='grid grid-cols-2 gap-4 gap-y-[30px] '>
									{data.map((item, i) => {
										return (
											<div
												className='w-[40vw] cursor-pointer h-[200px] rounded-[40px]'
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
								</div>
								<div className='flex max-w-[90vw] mt-[100px] items-center justify-center w-full'>
									<Pagination
										hideNextButton={true}
										hidePrevButton={true}
										boundaryCount={1}
										onChange={(_, page) => {
											setCurrentPage(page)
										}}
										page={currentPage}
										count={pages || 1}
									/>
								</div>
							</div>
						) : (
							<div></div>
						)}
					</div>
				</div>
			</Section>
		</div>
	)
}

export default CatalogPage
