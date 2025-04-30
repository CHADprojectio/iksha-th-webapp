import {useState, useEffect, useRef} from 'react'

interface FetchResult<T> {
	data: T[] | null
	loading: boolean
	error: string | null
	pages: number | null
	types: string[]
}

interface IState<T> {
	data: T[] | null
	pages: number | null
	types: string[]
}

export const useDatabaseItemsFetch = <T>(
	type: string | null,
	page: number,
	currentGroup: string | null, // Added missing comma here
	groupName: string | null
): FetchResult<T> => {
	const prevGroupName = useRef<null | string>(null)

	const [state, setState] = useState<IState<T>>({
		data: null,
		pages: null,
		types: []
	})
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const PAGE_SIZE = 10

	useEffect(() => {
		if (groupName !== prevGroupName.current) {
			currentGroup = ''
		}

		prevGroupName.current = groupName

		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_URL}webApp/data`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							type: type,
							page: page,
							pageSize: PAGE_SIZE,
							group: currentGroup,
							groupName: groupName,
						}),
					}
				)

				if (!res.ok) {
					throw new Error(`Failed to fetch data: ${res.statusText}`)
				}

				const result: { data: T[]; pages: number, types: string[] } = await res.json()

				setState({
					data: result.data,
					pages: result.pages,
					types: result.types
				})
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'Unknown error occurred'
				)
				setState({
					data: null,
					pages: null,
					types: [],
				})
			} finally {
				setLoading(false)
			}
		}

		if (type) {
			fetchData()
		}
	}, [type, page, currentGroup, groupName]) // Added currentGroup to the dependency array

	return {
		data: state.data,
		loading,
		error,
		pages: state.pages,
		types: state.types
	}
}
