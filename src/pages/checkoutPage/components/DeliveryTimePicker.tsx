import {Input, Select} from "@telegram-apps/telegram-ui";
import {useEffect, useMemo, useState} from "react";

const TIME_STEP = 30;

type TDeliveryTimePickerProps = {
    setTime: (delivery: string) => void;
    openTime: string;
    closeTime: string;
    deliveryTime: number;
}

const pad  = (n: number) => n.toString().padStart(2, "0");
const isoDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const toDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const DeliveryTimePicker = ({setTime, openTime, closeTime, deliveryTime}: TDeliveryTimePickerProps) => {
    const prettyTime = (timePoint: number) => {
        if (timePoint < 10) {
            return `0${timePoint}`
        }

        return timePoint
    }

    const getTimeSlots = (isToday: boolean) => {
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
                todaySlots.push(`${prettyTime(currentDateUTC.getHours())}:${prettyTime(currentDateUTC.getMinutes())}`)

                currentDateUTC.setMinutes(currentDateUTC.getMinutes() + TIME_STEP)
            } else if (currentDateUTC.getTime() <= closeTimeObj.getTime()) {
                todaySlots.push(`${prettyTime(currentDateUTC.getHours())}:${prettyTime(currentDateUTC.getMinutes())}`)
                currentDateUTC.setMinutes(currentDateUTC.getMinutes() + TIME_STEP)
            }

            tomorrowSlots.push(`${prettyTime(openTimeObj.getHours())}:${prettyTime(openTimeObj.getMinutes())}`)

            openTimeObj.setMinutes(openTimeObj.getMinutes() + TIME_STEP)
        }

        return isToday ? todaySlots : tomorrowSlots
    };

    const hasSlotsToday = useMemo(
        () => getTimeSlots(true).length > 0,
        []
    );

    const today    = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const minDate = hasSlotsToday ? isoDate(today) : isoDate(tomorrow);

    const [selectedDate, setSelectedDate] = useState<string | undefined>(minDate);
    const [currentTime, setCurrentTime] = useState<string | undefined>(getTimeSlots(true)[0]);

    useEffect(() => {
        setTime(`${isToday(selectedDate) ? 'Сегодня' : selectedDate} в ${currentTime}`)
    }, [selectedDate, currentTime]);

    const isToday = (iso?: string) => {
        if (!iso) return false;
        const d = new Date(iso);

        const today = new Date();
        return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        );
    }

    const handleDateChange = (value: string) => {
        const picked = toDate(value);
        const minDateObj = toDate(minDate);

        if (picked.getTime() < minDateObj.getTime()) {
            setSelectedDate(minDate);
        } else {
            setSelectedDate(value);
        }
    }

    return (
        <div className={"datetime-picker relative grid grid-cols-[55%_45%]"}>
            <Input
                header={'Дата'}
                type={"date"}
                value={selectedDate}
                onChange={e => handleDateChange(e.target.value)}
                min={minDate}
                before={<span>📆</span>}
            />
            <Select
                header='Время'
                className='h-[48px] m-0 p-1'
                value={currentTime}
                onChange={e => setCurrentTime(e.target.value)}
                before={<span>⏰</span>}
            >
                {getTimeSlots(isToday(selectedDate)).map((slot, i) => (
                    <option key={`${i}-${slot}`} value={slot}>
                        {slot}
                    </option>
                ))}
            </Select>
        </div>
    )
}

export default DeliveryTimePicker;
