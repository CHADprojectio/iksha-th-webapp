import {useEffect, useState} from "react";


type TLocationsResponse = {
    data: string[];
    isLoading: boolean;
};

export const useGetLocations = (): TLocationsResponse => {
    const [response, setResponse] = useState<TLocationsResponse["data"]>([])
    const [isLoading, setIsLoading] = useState<TLocationsResponse["isLoading"]>(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}webApp/locations`)

                if (res.ok) {
                    const result = await res.json()
                    setResponse(result)
                }
            } catch (e) { /* empty */ }

            setIsLoading(false)
        }

        fetchData()
    }, [])

    return {
        data: response,
        isLoading
    };
}
