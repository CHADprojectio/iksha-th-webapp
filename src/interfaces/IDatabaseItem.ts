export default interface IDatabaseItem {
	title: string
	price: number
	sheetName: string
	description?: string
	variants?: string[]
	priceVariants?: number[]
	paymentDescription?: string
	isStackable: boolean
	photoUrl: string[] | string
}
