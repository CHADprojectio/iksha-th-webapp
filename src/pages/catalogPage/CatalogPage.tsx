import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import IDatabaseItem from '../../interfaces/IDatabaseItem'
import ItemDetailsPopup from 'shared/popups/ItemDetailsPopup/ItemDetailsPopup'
import { Pagination, Section } from '@telegram-apps/telegram-ui'
import { useDatabaseItemsFetch } from 'src/hooks/useDatabaseItemsFetch'
import LoadingComponent from 'shared/LoadingComponent'
import TypesComponent from './components/TypesComponent'
import ImageComponent from 'shared/ImageComponent'
import getPhotoUrl from 'src/helpers/GetPhotoUrl'
import { useDatabaseTypesFetch } from 'src/hooks/useDatabaseTypesFetch'
import { useAppDispatch } from 'store/hooks'
import { setCurrentType } from 'store/slices/dataSlice'

interface CatalogProps {}

const CatalogPage: React.FC<CatalogProps> = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const [currentItem, setCurrentItem] = useState<IDatabaseItem | undefined>(
		undefined
	)
	const [currentPage, setCurrentPage] = useState(1)
	const queryParams = new URLSearchParams(location.search)
	const type = queryParams.get('type')
	const [currentSubType, setCurrentSubType] = useState<string>('')

	const subTypeName = type + 'Type'
	const { data, pages, loading, error } = useDatabaseItemsFetch<IDatabaseItem>(
		type,
		currentPage,
		currentSubType,
		subTypeName
	)

	const { types } = useDatabaseTypesFetch(subTypeName)

	console.log('current group: ' + currentSubType)

	useEffect(() => {
		setCurrentPage(1)
	}, [currentSubType])

	useEffect(() => {
		if (type) dispatch(setCurrentType(type))
	}, [type])

	useEffect(() => {
		if (types && types.length > 0) {
			if (types[0] == null) setCurrentSubType(types[1])
			setCurrentSubType(types[1])
		}
	}, [types])

	const [isItemDetailsPopupOpen, setIsItemDetailsPopup] = useState(false)
	const toggleItemDetailsPopup = () => {
		setIsItemDetailsPopup(!isItemDetailsPopupOpen)
	}

	if (error) {
		//
	}

	console.log(currentSubType)
	return (
		<div className='relative min-h-[100vh] bg-bg p-1 text-p'>
			<ItemDetailsPopup
				isItemDetailsPopupOpen={isItemDetailsPopupOpen}
				toggleItemDetailsPopup={toggleItemDetailsPopup}
				item={currentItem}
			/>
			<Section>
				<div className='relative p-5 pb-0'>
					<div className='text-[40px] text-h1 mb-5'>
						{type == 'food' ? 'Еда' : 'Услуги'}
					</div>
					<TypesComponent
						types={types}
						currentSubType={currentSubType}
						setCurrentSubType={setCurrentSubType}
					/>

					<div className=''>
						{loading && <LoadingComponent />}
						{type != undefined && data != null ? (
							<div>
								<div className='gap-4 flex flex-col gap-y-[30px] '>
									{data.map((item, i) => {
										return (
											<div
												className='w-full flex gap-2 cursor-pointer rounded-[40px]'
												onClick={() => {
													setCurrentItem(item)
													toggleItemDetailsPopup()
												}}
												key={i}
											>
												<ImageComponent
													src={getPhotoUrl(item?.photoUrl)}
													className='object-cover h-[128px] w-[128px]'
												/>
												{/* <img
													className='object-cover h-[128px] w-[128px]'
													src={item.photoUrl}
													alt='https://th.bing.com/th/id/OIP.W9-vYFSiy6LSJEHFokqofwHaHa?rs=1&pid=ImgDetMain'
												/> */}
												<div className='flex flex-col w-full'>
													<div className='w-full font-semibold text-h1'>
														{item.title}
													</div>
													<div className='text-p'>
														от {item.price} руб
													</div>
												</div>
											</div>
										)
									})}
								</div>
								<div className='flex w-[80vw] mt-[50px] items-center justify-center'>
									{pages && pages > 1 && (
										<Pagination
											hideNextButton={true}
											hidePrevButton={true}
											boundaryCount={1}
											siblingCount={1}
											onChange={(_, page) => {
												setCurrentPage(page)
											}}
											page={currentPage}
											count={pages || 1}
										/>
									)}
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
