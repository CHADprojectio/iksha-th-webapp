// Import the necessary styles globally
import '@telegram-apps/telegram-ui/dist/styles.css'

// Import components from the library
import { AppRoot, Card } from '@telegram-apps/telegram-ui'
import React from 'react'
import { CardCell } from '@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell'

const App = () => (
	<AppRoot>
		<Card onClick={() => {}}>
			<React.Fragment key='.0'>
				<img
					alt='Dog'
					src='https://i.imgur.com/892vhef.jpeg'
					style={{
						display: 'block',
						height: 308,
						objectFit: 'cover',
						width: 254,
					}}
				/>
				<CardCell readOnly subtitle='United states'>
					New York
				</CardCell>
			</React.Fragment>
		</Card>
	</AppRoot>
)

export default App
