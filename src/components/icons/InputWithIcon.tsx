import React from "react";

interface InputWithIconProps {
    Icon: React.ReactNode;
    placeholder: string;
    inputType: string;
    inputName: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string
}

const InputWithIcon: React.FC<InputWithIconProps> = ({ Icon, placeholder, inputType, inputName, value, onChange, className = "" }) => {
    return (
        <div className={`shadow-lg flex gap-2 items-center bg-whit p-2 duration-300 group rounded-md ${className}`}>
            <div className="group-hover:rotate-[360deg] duration-300">
                {Icon}
            </div>
            <input
                type={inputType}
                name={inputName}
                className="flex-1 focus:outline-none focus:border-none rounded-md text-gray-900 p-1.5"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default InputWithIcon;