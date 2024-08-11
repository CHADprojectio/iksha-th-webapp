import { get, ref } from 'firebase/database'
import { db } from './firebase-config'
import IDatabaseItem from '../interfaces/IDatabaseItem'

export const getByType = async (type: string) => {
	const foodData: IDatabaseItem[] = []
	try {
		const WebAppItemsRef = ref(db, 'WebAppItems')
		const snapshot = await get(WebAppItemsRef)
		if (snapshot.exists()) {
			snapshot.forEach(child => {
				const childData = child.val()
				if (childData.type === type) {
					foodData.push(childData)
				}
			})
			return foodData
		} else {
			console.log('No data available')
			return []
		}
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
