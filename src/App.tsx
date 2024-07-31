// Import the necessary styles globally
import '@telegram-apps/telegram-ui/dist/styles.css'

// Import components from the library
import { AppRoot, Cell, List, Section } from '@telegram-apps/telegram-ui'

// Example data for rendering list cells
const cellsTexts = ['Chat Settings', 'Data and Storage', 'Devices']

export const App = () => (
	<AppRoot>
		{/* List component to display a collection of items */}
		<List>
			{/* Section component to group items within the list */}
			<Section
				header='Header for the section'
				footer='Footer for the section'
			>
				{/* Mapping through the cells data to render Cell components */}
				{cellsTexts.map((cellText, index) => (
					<Cell key={index}>{cellText}</Cell>
				))}
			</Section>
		</List>
	</AppRoot>
)
