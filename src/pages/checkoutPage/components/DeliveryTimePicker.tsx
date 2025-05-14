import {Select} from "@telegram-apps/telegram-ui";
import {useEffect, useMemo, useState} from "react";

const TIME_STEP = 30;

type TDeliveryTimePickerProps = {
    setTime: (delivery: string) => void;
    openTime: string;
    closeTime: string;
    deliveryTime: number;
}

const DeliveryTimePicker = ({setTime, openTime, closeTime, deliveryTime}: TDeliveryTimePickerProps) => {
    const prettyTime = (timePoint: number) => {
        if (timePoint < 10) {
            return `0${timePoint}`
        }

        return timePoint
    }

    const allTimeSlots = useMemo(() => {
        const todaySlots: string[] = [];
        const tomorrowSlots: string[] = [];

        const currentDate = new Date();

        let currentDateUTC = new Date(currentDate.toUTCString());
        currentDateUTC.setHours(currentDateUTC.getUTCHours() + 3);
        const currentMinutes = currentDateUTC.getMinutes();
        currentDateUTC.setMinutes(currentMinutes + deliveryTime)

        const openTimeObj = new Date(currentDate.toUTCString())
        const [openHours, openMinutes] = openTime.split(":").map(Number);
        const openTimeMinutes = openMinutes + deliveryTime;
        openTimeObj.setHours(openHours, openTimeMinutes);

        const closeTimeObj = new Date(currentDate.toUTCString());
        const [closeHours, closeMinutes] = closeTime.split(":").map(Number);
        closeTimeObj.setHours(closeHours, closeMinutes);

        while (openTimeObj.getTime() <= closeTimeObj.getTime()) {
            if (currentDateUTC.getTime() < openTimeObj.getTime()) {
                currentDateUTC = new Date(openTimeObj.getTime());
                todaySlots.push(`Сегодня в ${prettyTime(currentDateUTC.getHours())}:${prettyTime(currentDateUTC.getMinutes())}`)

                currentDateUTC.setMinutes(currentDateUTC.getMinutes() + TIME_STEP)
            } else if (currentDateUTC.getTime() <= closeTimeObj.getTime()) {
                todaySlots.push(`Сегодня в ${prettyTime(currentDateUTC.getHours())}:${prettyTime(currentDateUTC.getMinutes())}`)
                currentDateUTC.setMinutes(currentDateUTC.getMinutes() + TIME_STEP)
            }

            tomorrowSlots.push(`Завтра в ${prettyTime(openTimeObj.getHours())}:${prettyTime(openTimeObj.getMinutes())}`)

            openTimeObj.setMinutes(openTimeObj.getMinutes() + TIME_STEP)
        }

        return [...todaySlots, ...tomorrowSlots]
    }, [openTime, closeTime, deliveryTime]);

    const [currentTime, setCurrentTime] = useState<string | undefined>(allTimeSlots[0]);

    useEffect(() => {
        setTime(allTimeSlots[0] ?? "")
    }, []);

    return (
        <div>
            <Select
                header='Время доставки'
                before={<span>⏰️</span>}
                className='h-[48px] m-0 p-1'
                value={currentTime}
                onChange={e => setCurrentTime(e.target.value)}
                // disabled={isLoading}
            >
                {allTimeSlots.map((slot, i) => (
                    <option key={`${i}-${slot}`} value={slot}>
                        {slot}
                    </option>
                ))}
            </Select>
        </div>
    )
}

export default DeliveryTimePicker;
