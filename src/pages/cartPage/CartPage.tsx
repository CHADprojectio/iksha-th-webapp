import {Button, Divider, IconButton} from '@telegram-apps/telegram-ui'
import React, {useEffect, useMemo} from 'react'
import {Spinner} from '@telegram-apps/telegram-ui'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {removeFromCart} from 'store/slices/cartSlice'
import close from 'icons/close.png'
import {useNavigate} from 'react-router-dom'
import getPhotoUrl from 'src/helpers/GetPhotoUrl'
import {useGetCartInfo} from "../../hooks/useGetCartInfo.ts";
import {cn} from "../../lib/utils.ts";

interface CartPageProps {
    toggleCartOpen: () => void
}

const CartPage: React.FC<CartPageProps> = ({toggleCartOpen}) => {
    const cart = useAppSelector(state => state.cart.cart)

    const cartInfo = useGetCartInfo();

    useEffect(() => {
        console.log(cartInfo)
    }, [cartInfo]);

    const summary = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    const isAmountInconsistent = useMemo(() => {
        const minPaySum = cartInfo.data?.minBuySum ?? summary;
        return summary < minPaySum;
    }, [summary, cartInfo.data])

    const payButtonText = useMemo(() => isAmountInconsistent ? `Минимальная сумма ${cartInfo.data?.minBuySum}р` : `Оплатить ${summary}р`, [isAmountInconsistent, cartInfo.data?.minBuySum, summary])

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return (
        <div
            style={{background: 'var(--tgui--secondary_bg_color)'}}
            className='popup_bg z-[1000] p-2 text-p bg-bg'
        >
            <div className='flex justify-between'>
                <h1 className='text-[25px] text-h1 mb-4'>Корзина</h1>

                <IconButton
                    mode='bezeled'
                    size='s'
                    className='flex w-[35px] justify-center items-center h-[35px]'
                    // style={{ width: '40px', height: '40px' }}
                    onClick={() => {
                        toggleCartOpen()
                    }}
                >
                    <img src={close} alt=''/>
                </IconButton>
            </div>
            {cart.length == 0 ? (
                <div>В корзине пусто....</div>
            ) : (
                <div className='flex flex-col'>
                    <div className='mb-[30px] '>
                        <div className='overflow-y-scroll flex flex-col gap-[40px] h-[70vh]'>
                            {cart.map((item, i) => {
                                return (
                                    <div
                                        className={`gap-4 items-center text-p text-[20px]`}
                                        key={i}
                                    >
                                        <div className='flex mb-3'>
                                            <img
                                                className='h-[64px] w-[64px]'
                                                src={getPhotoUrl(item?.photoUrl)}
                                                alt={item.title}
                                            />
                                            <div className='flex flex-col w-full'>
                                                <div className='flex items-center justify-between'>
                                                    <h2>{item.title}</h2>
                                                    <IconButton
                                                        mode='bezeled'
                                                        size='s'
                                                        className='flex w-[20px] justify-center items-center h-[20px]'
                                                        // style={{ width: '40px', height: '40px' }}
                                                        onClick={() => {
                                                            dispatch(
                                                                removeFromCart({
                                                                    variant: item.variant,
                                                                    title: item.title,
                                                                })
                                                            )
                                                        }}
                                                    >
                                                        <img src={close} alt=''/>
                                                    </IconButton>
                                                </div>
                                                <div className='text-[12px]'>
                                                    {item.variant}
                                                </div>
                                            </div>
                                        </div>
                                        <Divider/>
                                        <div className='flex justify-between mt-2'>
                                            <div className='flex gap-2'>
                                                <div className='text-[15px]'>
                                                    {item.price}р
                                                </div>
                                                <div className='text-[15px]'>
                                                    x{item.quantity}
                                                </div>
                                            </div>

                                            <div className='text-[15px]'>
                                                {item.price * item.quantity}р
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div></div>
                    <Button
                        disabled={cartInfo.isLoading || isAmountInconsistent}
                        onClick={() => {
                            navigate('/checkout')
                            toggleCartOpen()
                        }}
                        style={{backgroundColor: isAmountInconsistent ? "#ef4444" : "#2a90ff"}}
                    >
                        <div className={cn("flex items-center justify-center")}>
                            {
                                cartInfo.isLoading ? (
                                    <Spinner className={"text-white"} size={"s"}></Spinner>
                                ) : payButtonText
                            }
                        </div>
                    </Button>
                </div>
            )}{' '}
        </div>
    )
}

export default CartPage
