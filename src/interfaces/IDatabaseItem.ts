export default interface IDatabaseItem {
	title: string
	price: number
	type: string
	description?: string
	variants?: string[]
	priceVariants?: number[]
	paymentDescription?: string
	isStackable: boolean
	photoUrl: string
}
