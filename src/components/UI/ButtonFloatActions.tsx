import React from "react";

interface ButtonFloatActionsProps {
    onSave: () => void;
    onSaveAndUpdateEtour: () => void;
}

const ButtonFloatActions: React.FC<ButtonFloatActionsProps> = ({ onSave, onSaveAndUpdateEtour }) => {
    return (
        <>
            <div className="fixed flex flex-col items-end gap-2 top-[80%] right-0 z-10 mr-12">
                <button type="button" className="focus:outline-none bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-800" onClick={onSave}>
                    <p>Lưu tạm</p>
                </button>
                <button className="focus:outline-none bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-cyan-400 dark:hover:bg-cyan-500 dark:focus:ring-cyan-800" onClick={onSaveAndUpdateEtour}>
                    Lưu và cập nhật eTour
                </button>
            </div>
        </>
    );
}

export default ButtonFloatActions;