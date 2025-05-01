import {Input, Slider} from "@telegram-apps/telegram-ui";
import {useEffect, useState} from "react";
import {TDeliveryTime} from "../types.ts";

const TIME_STEP = 30;

type TDeliveryTimePickerProps = {
    setTime: (delivery: TDeliveryTime) => void;
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

    const getMaxSliderValue = () => {
        const currentTime = new Date();
        let currentTimeUTC = new Date(currentTime.toUTCString());

        currentTimeUTC.setHours(currentTimeUTC.getUTCHours() + 3);
        const currentMinutes = currentTimeUTC.getMinutes();
        currentTimeUTC.setMinutes(currentMinutes + deliveryTime);

        const closeTimeObj = new Date(currentTimeUTC.toUTCString());
        const [closeHours, closeMinutes] = closeTime.split(":").map(Number);
        closeTimeObj.setHours(closeHours, closeMinutes);

        const openTimeObj = new Date(currentTimeUTC.toUTCString())
        const [openHours, openMinutes] = openTime.split(":").map(Number);
        openTimeObj.setHours(openHours, openMinutes + deliveryTime);

        if (currentTimeUTC.getTime() - openTimeObj.getTime() < 0) {
            currentTimeUTC = openTimeObj;
        }

        const diffInMilliseconds = closeTimeObj.getTime() - currentTimeUTC.getTime();

        const diffInMinutes = diffInMilliseconds / (1000 * 60);

        const maxSliderValue = Math.floor(diffInMinutes / TIME_STEP);

        return maxSliderValue < 0 ? 0 : maxSliderValue;
    }

    const getDeliveryTime = (step: number = 0): TDeliveryTime => {
        let dayPoint: TDeliveryTime["dayPoint"] = "today"
        let time: TDeliveryTime["time"] = "";

        const currentTime = new Date();
        const currentTimeUTC = new Date(currentTime.toUTCString());

        currentTimeUTC.setHours(currentTimeUTC.getUTCHours() + 3);
        const currentMinutes = currentTimeUTC.getMinutes();

        const increasedTimeUTC = new Date(currentTime.toUTCString())
        currentTimeUTC.setHours(currentTimeUTC.getUTCHours() + 3);
        increasedTimeUTC.setMinutes(currentMinutes + deliveryTime + (TIME_STEP * step));

        const closeTimeObj = new Date(currentTimeUTC.toUTCString());
        const [closeHours, closeMinutes] = closeTime.split(":").map(Number);
        closeTimeObj.setHours(closeHours, closeMinutes);

        const openTimeObj = new Date(currentTimeUTC.toUTCString())
        const [openHours, openMinutes] = openTime.split(":").map(Number);
        openTimeObj.setHours(openHours, openMinutes + deliveryTime);

        time = `${prettyTime(increasedTimeUTC.getHours())}:${prettyTime(increasedTimeUTC.getMinutes())}`

        if (closeTimeObj.getTime() - increasedTimeUTC.getTime() < 0) {
            time = `${prettyTime(closeTimeObj.getHours())}:${prettyTime(closeTimeObj.getMinutes())}`
        }

        if (currentTimeUTC.getTime() - openTimeObj.getTime() < 0) {
            const openTimeMinutes = openTimeObj.getMinutes()
            openTimeObj.setMinutes(openTimeMinutes + (TIME_STEP * step))
            time = `${prettyTime(openTimeObj.getHours())}:${prettyTime(openTimeObj.getMinutes())}`
        }

        if (closeTimeObj.getTime() - currentTimeUTC.getTime() < 0) {
            dayPoint = "next"
            time = `${prettyTime(openTimeObj.getHours())}:${prettyTime(openTimeObj.getMinutes())}`
        }

        return {
            dayPoint,
            time,
        }
    }

    const [delivery, setDelivery] = useState(getDeliveryTime())

    useEffect(() => {
        setTime(getDeliveryTime())
    }, []);

    const onSliderValueChange = (step: number) => {
        const delivery = getDeliveryTime(step);
        setDelivery(delivery)
        setTime(delivery)
    }

    return (
        <div className={"relative grid grid-cols-[60%_40%]"}>
            <Input className={"pointer-events-none text-sm"} value={`${delivery.dayPoint === "next" ? 'Завтра' : 'Сегодня'} в ${delivery.time}`} header={'Время доставки'} readOnly></Input>
            <Slider disabled={getMaxSliderValue() === 0} defaultValue={0} min={0} max={getMaxSliderValue()} onChange={onSliderValueChange}></Slider>
        </div>
    )
}

export default DeliveryTimePicker;
