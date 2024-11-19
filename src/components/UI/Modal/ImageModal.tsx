import React from "react";

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 space-y-4 max-w-sm w-full">
                <h2 className="text-xl font-semibold">Hình ảnh Passport</h2>
                <img
                    src={imageUrl}
                    alt="Passport Image"
                    className="w-full h-auto object-cover rounded-md"
                    loading="lazy"
                />
                <button
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
                    onClick={onClose}
                >
                    Đóng
                </button>
            </div>
        </div>
    )
}

export default ImageModal;