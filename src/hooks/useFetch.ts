import { useState, useEffect } from 'react'

interface FetchResult<T> {
	data: T[] | null
	loading: boolean
	error: string | null
}

export const useFetch = <T>(
	type: string | null,
	page: number
): FetchResult<T> => {
	const [data, setData] = useState<T[] | null>([])
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

				const result: T[] = await res.json()
				setData(result)
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'Unknown error occurred'
				)
				setData(null) // Clear data if there's an error
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [type, page])

	return { data, loading, error }
}
