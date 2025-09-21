import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LoadingComponent from "shared/LoadingComponent.tsx";
import {IconButton} from "@telegram-apps/telegram-ui";
import close from "icons/close.png";

type TStatusValue = "ok" | "failed";
const successText = 'Спасибо! Мы приняли ваш заказ и скоро его принесем'
const failedText = 'Кажется оплата не прошла, попробуйте снова'

const PaymentStatus = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [paymentStatus, setPaymentStatus] = useState<undefined | TStatusValue>()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const statusValue = queryParams.get('v')
        if (statusValue) {
            setPaymentStatus(statusValue as TStatusValue)
        }
    }, [location]);

    return (
        <div
            style={{background: 'var(--tgui--secondary_bg_color)'}}
            className='relative flex flex-col min-h-screen gap-[20px] p-[10px] text-p'
        >
            {!paymentStatus && <LoadingComponent/>}
            {
                paymentStatus && (
                    <>
                        <div
                            onClick={() => {
                                navigate('/catalog?type=food')
                            }}
                            className='fixed top-4 right-4'
                        >
                            <IconButton
                                mode='bezeled'
                                size='s'
                                className='flex w-[35px] justify-center items-center h-[35px]'
                                // style={{ width: '40px', height: '40px' }}
                            >
                                <img src={close} alt=''/>
                            </IconButton>
                        </div>
                        <h1 className={"text-center font-bold my-auto"}>{paymentStatus === 'ok' ? successText : failedText}</h1>
                    </>
                )
            }
        </div>
    )
}

export default PaymentStatus;
