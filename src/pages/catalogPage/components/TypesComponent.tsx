import React from 'react'

interface TypesComponentProps {
	setCurrentSubType: React.Dispatch<React.SetStateAction<string>>
	currentSubType: string
	types: string[] | null
}
const TypesComponent: React.FC<TypesComponentProps> = ({
	setCurrentSubType,
	currentSubType,
	types,
}) => {
	console.log('currentGroup: ' + currentSubType)
	if (!types) return
	console.log(types)
	return (
		<div>
			{types && (
				<div className='flex gap-4 my-5 overflow-x-scroll'>
					{types.map((item, i) => {
						if (item == null) {
							return
						}
						return (
							<div
								onClick={() => {
									setCurrentSubType(item)
								}}
								style={{
									cursor: 'pointer',
									backgroundColor:
										currentSubType == item
											? 'var(--tgui--button_color)'
											: 'var(--tgui--secondary_fill)',
									color: 'var(--tgui--button_text_color)',
								}}
								className={`${
									currentSubType == item ? '' : ''
								} px-2 rounded-lg flex justify-center cursor-pointer items-center text-nowrap`}
								key={i}
							>
								<div>{item}</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default TypesComponent
