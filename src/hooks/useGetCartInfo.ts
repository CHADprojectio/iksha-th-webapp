import {useEffect, useState} from "react";
import {TCartInfo} from "../types/cart.ts";


type TCartInfoResponse = {
    data: TCartInfo | null;
    isLoading: boolean;
};

export const useGetCartInfo = (): TCartInfoResponse => {
    const [cartResponse, setCartResponse] = useState<TCartInfoResponse["data"]>(null)
    const [isLoading, setIsLoading] = useState<TCartInfoResponse["isLoading"]>(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}webApp/cartInfo`)

                if (res.ok) {
                    const result = await res.json()
                    setCartResponse(result)
                }
            } catch (e) { /* empty */ }

            setIsLoading(false)
        }

        fetchData()
    }, [])

    return {
        data: cartResponse,
        isLoading
    };
}
