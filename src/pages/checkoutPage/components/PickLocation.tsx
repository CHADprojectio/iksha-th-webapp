import {Select} from '@telegram-apps/telegram-ui'
import React from 'react'

interface PickLocationProps {
	locations: string[]
	currentLocation: string | undefined;
	setCurrentLocation: (value: string) => void;
	isLoading?: boolean;
}

const PickLocation: React.FC<PickLocationProps> = ({
	locations,
	currentLocation,
	setCurrentLocation,
	isLoading
}) => {
	return (
		<div>
			<Select
				header='Ваше место проживания'
				before={<span>🗺️</span>}
				className='h-[48px] m-0 p-1'
				value={currentLocation}
				onChange={e => setCurrentLocation(e.target.value)}
				disabled={isLoading}
			>
				{locations.map((variant, i) => (
					<option key={i} value={variant}>
						{variant}
					</option>
				))}
			</Select>
		</div>
	)
}

export default PickLocation
