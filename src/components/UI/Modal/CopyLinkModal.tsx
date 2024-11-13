import React from "react";
import QRCode from "react-qr-code";

interface CopyLinkModalProps {
    isOpen: boolean;
    qrCode: string;
    onClose: () => void;
    copyLink: () => void;
}

const CopyLinkModal: React.FC<CopyLinkModalProps> = ({ isOpen, qrCode, onClose, copyLink }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 space-y-4 max-w-lg w-full">
                <h2 className="text-xl font-semibold">Quét mã để mở trang</h2>
                <div className="flex justify-center">
                    <QRCode value={qrCode} />
                </div>
                <p className="text-center cursor-pointer font-semibold hover:underline" onClick={copyLink}>Hoặc nhấn vào đây để sao chép đường dẫn</p>
                <button
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
                    onClick={onClose}
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default CopyLinkModal;