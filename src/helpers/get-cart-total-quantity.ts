import ICartItem from "interfaces/ICartItem.ts";


export const getCartTotalQuantity = (cartData: ICartItem[]) => {
    return cartData.reduce((acc, cur) => acc + (cur.quantity), 0)
}
