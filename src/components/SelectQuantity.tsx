import {Button} from "@telegram-apps/telegram-ui";
import {cn} from "../lib/utils.ts";

type TSelectQuantityProps = {
    handleQuantityChange: (val: "increment" | "decrement") => void;
    quantity: number;
    size: "l" | "m";
    minQuantity?: number;
    className?: string;
}

const SelectQuantity = ({handleQuantityChange, quantity, size, minQuantity = 0, className}: TSelectQuantityProps) => {

    return (
        <div className={cn("flex items-center border-[#2a90ff] border rounded-lg", className)}>
            <Button className={cn({
                "w-4 h-4": size === "m"
            })} disabled={minQuantity >= quantity} style={{borderRadius: "0.5rem", height: size === "m" ? "1.5rem" : "42px"}}
                    onClick={() => handleQuantityChange("decrement")}>
                -
            </Button>
            <div className={cn("h-full flex items-center justify-center text-xl text-[#2a90ff]", {
                "w-36": size === "l",
                "w-16 text-sm": size === "m",
            })}>
                {quantity}
            </div>
            <Button className={cn({
                "w-4 h-4": size === "m"
            })} style={{borderRadius: "0.5rem", height: size === "m" ? "1.5rem" : "42px"}}
                    onClick={() => handleQuantityChange("increment")}>
                +
            </Button>
        </div>
    )
}

export default SelectQuantity
