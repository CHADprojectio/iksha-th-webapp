export default interface IDatabaseItem {
	title: string
	price: number
	type: string
	description?: string
	paymentDescription?: string
	isStackable: boolean
	photoUrl: string
}
