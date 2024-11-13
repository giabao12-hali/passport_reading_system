import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ButtonFloatActions from "./UI/ButtonFloatActions";
import { ApiPassportResponse, eTourCustomer } from "../api/interfaces";
import { deletePassportDataApi, fetchUploadApi, savePassportDataApi, showPassportDataApi } from "../api/ApiService";
import PassportUpload from "./layout/PassportUpload";
import CustomToast from "./UI/CustomToast";
import CopyLinkModal from "./UI/Modal/CopyLinkModal";
import PassportEtourTableLayout from "./layout/TableLayout";
import { Card, FileInput, Label, Tooltip } from "flowbite-react";
import { Info } from "lucide-react";

const TourPassportDashboard: React.FC = () => {

    const [dataExtract, setDataExtract] = useState<ApiPassportResponse[]>([]); //* Lưu list passport
    const [dataEtour, setDataEtour] = useState<eTourCustomer[]>([]); //* Lưu list eTour
    const [dataUpload, setDataUpload] = useState<ApiPassportResponse[]>([]); //* Lưu list upload
    const [etourUpload, setEtourUpload] = useState<eTourCustomer[]>([]); //* Lưu list upload eTour



    // Loading
    const [loading, setLoading] = useState(false);
    const [loadingPassportUpload, setLoadingPassportUpload] = useState(false);

    //#region QR Code Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const qrCode = window.location.href;

    const handleCopyUrl = async () => {
        const currentUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(currentUrl);
            showToastMessage("Đã sao chép đường dẫn thành công", "success");
        } catch (error) {
            console.error("Copy fail:", error);
            showToastMessage("Sao chép đường dẫn thất bại", "error");
        }
    }
    const QrCodeModalOpen = () => {
        setIsModalOpen(true);
    }
    const QrCodeModalClose = () => {
        setIsModalOpen(false);
    }
    //#endregion


    //#region Toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const showToastMessage = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };
    //#endregion

    //#region Location Router
    const location = useLocation();
    const [bookingId, setBookingId] = useState<string>('');
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("bookingId");
        if (id) {
            setBookingId(id);
        }
    }, [location.search]);
    //#endregion

    //#region Show Data
    useEffect(() => {
        if (!bookingId) return;
        const showPassportData = async () => {
            setLoading(true);
            // setLoadingETour(true);
            try {
                const response = await showPassportDataApi(bookingId);
                setDataExtract(response.dataExtract);
                setDataEtour(response.dataEtour);
            } catch (error) {
                console.log("Error fetching passport data", error);
            } finally {
                setLoading(false);
                // setLoadingETour(false);
            }
        }
        showPassportData();
    }, [bookingId]);
    //#endregion

    //#region Format Date & Sex
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };
    const formatSex = (isMale: boolean): string => {
        return isMale ? "Nam" : "Nữ";
    };
    //#endregion

    //#region Upload Passport
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        try {
            setLoadingPassportUpload(true);
            const { dataUpload, etourUpload } = await fetchUploadApi(files, bookingId);
            setDataUpload(dataUpload);
            setEtourUpload(etourUpload);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPassportUpload(false);
        }
    }
    //#endregion

    //#region Save Passport Data & Update eTour
    const handleSave = async () => {
        try {
            handleSaveTemp(dataUpload);
            await savePassportDataApi(dataUpload);
            showToastMessage("Lưu thành công!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error(err);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeNullFields = (data: any): any => {
        if (Array.isArray(data)) {
            return data.map(item => removeNullFields(item)); // Áp dụng đệ quy cho mỗi phần tử trong mảng
        } else if (typeof data === "object" && data !== null) {
            return Object.fromEntries(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(data).filter(([_, value]) => value !== null) // Lọc bỏ các key có giá trị null
            );
        }
        return data;
    };

    const handleSaveAndUpdateEtour = async () => {
        await savePassportDataApi(dataUpload);

        const filteredDataCombine = [...dataExtract, ...dataUpload];
        const filteredData = removeNullFields(filteredDataCombine);
        console.log("Dữ liệu Passport: ", JSON.stringify(filteredData, null, 2));
        showToastMessage("Đang cập nhật dữ liệu...", "info");
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const handleSaveTemp = (updatedData: ApiPassportResponse[]) => {
        setDataUpload(updatedData);
    }

    //#endregion

    //#region Delete Passport
    const handleDeletePassport = async (id: number) => {
        try {
            const deleteSuccess = await deletePassportDataApi(id);
            if (deleteSuccess) {
                setDataExtract((prev) => prev.filter(passport => passport.id !== id));
                showToastMessage("Xóa thành công!", "success");
            } else {
                showToastMessage("Xóa thất bại!", "error");
            }
        } catch (error) {
            console.error("Delete fail:", error);
            showToastMessage("Xóa thất bại!", "error");
        }
    }

    const handleDeletePassportUpload = (index: number) => {
        setDataUpload((prevData) => prevData.filter((_, i) => i !== index));
        showToastMessage("Xóa thành công!", "success");
    }
    //#endregion

    return (
        <>
            <div className="px-12 py-2">
                <div className="w-full flex items-center justify-between mobile:flex-col mobile:space-y-8">
                    <div className="translate-y-4">
                        <button
                            type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={QrCodeModalOpen}
                        >
                            Hiển thị mã QR Code
                        </button>
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="multiple-file-upload" value="Đính kèm ảnh Passport" />
                        </div>
                        <FileInput
                            id="multiple-file-upload"
                            multiple helperText="Giới hạn tối đa 3MB..."
                            onChange={handleFileUpload} />
                    </div>
                    {/* <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mobile:text-center" htmlFor="multiple_files">
                            Đính kèm hình ảnh Passport
                        </label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="multiple_files"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            required
                        />
                    </div> */}
                </div>
                {/* <div className="grid grid-cols-2 my-12 gap-12">
                    <EtourListTable dataEtour={dataEtour} formatDate={formatDate} formatSex={formatSex} loadingETour={loadingETour}/>
                    <PassportListTable dataExtract={dataExtract} formatDate={formatDate} formatSex={formatSex} loadingListPassport={loadingListPassport} />
                </div> */}
                <div className="flex items-center gap-2 mt-12 mobile:flex-col mobile:mt-4">
                    <div className="inline-flex items-center gap-12">
                        <div className="flex items-center gap-4">
                            <div className="border border-solid border-gray-100 bg-cyan-200 p-2 rounded-full"></div>
                            <p>eTour</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border border-solid border-gray-100 bg-green-300 p-2 rounded-full"></div>
                            <p>Dữ liệu đã lưu tạm thời</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>✅</div>
                            <p>Đã đối soát</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>❌</div>
                            <p>Chưa đối soát</p>
                        </div>
                    </div>
                    {/* <div className="flex items-center justify-center gap-2">
                        <h1 className="font-semibold text-2xl text-center">Đối chiếu Danh sách eTour</h1>
                        <Tooltip content="Danh sách đã lưu từ hệ thống eTour">
                            <Info className="size-5 text-cyan-500 translate-y-0.5" />
                        </Tooltip>
                        <h1 className="font-semibold text-2xl text-center">và</h1>
                        <h1 className="font-semibold text-2xl text-center">Đối chiếu Danh sách đã lưu</h1>
                        <Tooltip content="Danh sách đã lưu từ hệ thống">
                            <Info className="size-5 text-cyan-500 translate-y-0.5" />
                        </Tooltip>
                    </div> */}
                </div>
                <div className="w-full my-4">
                    <PassportEtourTableLayout
                        formatDate={formatDate}
                        formatSex={formatSex}
                        loading={loading}
                        dataExtract={dataExtract}
                        dataEtour={dataEtour}
                        onDeletePassport={handleDeletePassport}
                    />
                </div>

                {/* <div className="grid grid-cols-2 my-12 gap-12">
                    <ETourList dataEtour={dataEtour} formatDate={formatDate} formatSex={formatSex} loadingETour={loadingETour} />
                    <PassportList
                        bookingId={bookingId}
                        formatDate={formatDate}
                        formatSex={formatSex}
                        onDeleteShowToast={() => showToastMessage("Xóa thành công!", "success")}
                        loadingListPassport={loadingListPassport}
                        onDataExtractUpdate={handleDataExtractUpdate}
                        dataExtract={dataExtract}
                        onDeletePassport={handleDeletePassport}
                    />
                </div> */}
                <hr />
                <div className="mt-4">
                    <PassportUpload
                        dataUpload={dataUpload}
                        // etourUpload={etourUpload}
                        formatDate={formatDate}
                        formatSex={formatSex}
                        loadingPassportUpload={loadingPassportUpload}
                        onSaveTemp={handleSaveTemp}
                        onDeletePassportUpload={handleDeletePassportUpload}
                    />
                </div>
            </div>
            <ButtonFloatActions onSave={handleSave} onSaveAndUpdateEtour={handleSaveAndUpdateEtour} />
            <CopyLinkModal isOpen={isModalOpen} qrCode={qrCode} onClose={QrCodeModalClose} copyLink={handleCopyUrl} />
            {showToast && <CustomToast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
        </>
    );
}

export default TourPassportDashboard;