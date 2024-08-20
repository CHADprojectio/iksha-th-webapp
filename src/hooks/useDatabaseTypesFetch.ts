import { useState, useEffect } from 'react'

interface FetchResult {
	types: string[] | null
	loading: boolean
	error: string | null
}

export const useDatabaseTypesFetch = (type: string | null): FetchResult => {
	const [state, setState] = useState<string[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_URL}webApp/types`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ type: type }),
					}
				)

				if (!res.ok) {
					throw new Error(`Failed to fetch data: ${res.statusText}`)
				}

				const result: { types: string[] } = await res.json()

				setState(result.types)
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'Unknown error occurred'
				)
				setState(null)
			} finally {
				setLoading(false)
			}
		}

		if (type) {
			fetchData()
		}
	}, [type])

	return {
		types: state,
		loading,
		error,
	}
}
