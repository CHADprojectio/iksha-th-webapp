import { useState, useEffect } from 'react'

interface FetchResult<T> {
	data: T[] | null
	loading: boolean
	error: string | null
	pages: number | null
}

interface IState<T> {
	data: T[] | null
	pages: number | null
}

export const useDatabaseItemsFetch = <T>(
	type: string | null,
	page: number
): FetchResult<T> => {
	const [state, setState] = useState<IState<T>>({
		data: null,
		pages: null,
	})
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const PAGE_SIZE = 10

	useEffect(() => {
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
						body: JSON.stringify({ type, page, pageSize: PAGE_SIZE }),
					}
				)

				if (!res.ok) {
					throw new Error(`Failed to fetch data: ${res.statusText}`)
				}

				const result: { data: T[]; pages: number } = await res.json()

				setState({
					data: result.data,
					pages: result.pages,
				})
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'Unknown error occurred'
				)
				setState({
					data: null,
					pages: null,
				})
			} finally {
				setLoading(false)
			}
		}

		if (type) {
			fetchData()
		}
	}, [type, page])

	return {
		data: state.data,
		loading,
		error,
		pages: state.pages,
	}
}
