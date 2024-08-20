import { Text } from '@telegram-apps/telegram-ui'
import React from 'react'
import { useDatabaseTypesFetch } from 'src/hooks/useDatabaseTypesFetch'

interface TypesComponentProps {
	setCurrentGroup: React.Dispatch<React.SetStateAction<string>>
	currentGroup: string
}

const TypesComponent: React.FC<TypesComponentProps> = ({
	currentGroup,
	setCurrentGroup,
}) => {
	const { types } = useDatabaseTypesFetch('foodType')

	return (
		<div>
			{types && (
				<div className='flex gap-4 my-5 overflow-x-scroll text-nowrap'>
					{types.map((item, i) => {
						return (
							<div
								onClick={() => {
									setCurrentGroup(item)
								}}
								style={{
									backgroundColor:
										currentGroup == item
											? 'var(--tgui--button_color)'
											: 'var(--tgui--quartenary_bg_color)',
									color: 'var(--tgui--button_text_color)',
								}}
								className={`${
									currentGroup == item ? '' : ''
								} px-2 rounded-lg`}
								key={i}
							>
								<Text>{item}</Text>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default TypesComponent
