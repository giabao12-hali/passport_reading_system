import { Toast } from "flowbite-react";
import { Check, Info, X } from "lucide-react";
import React, { useEffect } from "react";

interface CustomToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void
}

const CustomToast: React.FC<CustomToastProps> = ({message, type, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose])

    const getIcon = () => {
        switch (type) {
            case "success":
                return <Check className="size-5"/>
            case "error":
                return <X className="size-5"/>
            case "info":
                return <Info className="size-5"/>
        }
    }

    const bgColor = type === "success" ? "bg-green-100 text-green-500" : type === "error" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500";

    return ( 
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Toast>
                <div className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${bgColor}`}>
                    {getIcon()}
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                {/* <Toast.Toggle onClick={onClose} /> */}
            </Toast>
        </div>
     );
}
 
export default CustomToast;