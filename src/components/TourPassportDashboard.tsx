import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import ButtonFloatActions from "./UI/ButtonFloatActions";
import { ApiPassportResponse, ApiTotalResponse, eTourCustomer } from "../api/interfaces";
import { deletePassportDataApi, fetchUploadApi, savePassportDataApi, showPassportDataApi, updatePassportDataApi } from "../api/ApiService";
import CustomToast from "./UI/CustomToast";
import CopyLinkModal from "./UI/Modal/CopyLinkModal";
import { FileInput, Label, Spinner } from "flowbite-react";
import TableLayoutNew from "./layout/TableLayoutNew";
import ReadPassportOnly from "./layout/ReadPassportOnly";
// import TableDemo from "./layout/TableDemo";
// import ButtonFloatActionsMobile from "./UI/ButtonFloatActionsMobile";`
// import { Info } from "lucide-react";

const TourPassportDashboard: React.FC = () => {

    const [dataExtract, setDataExtract] = useState<ApiPassportResponse[]>([]); //* Lưu list passport
    const [dataEtour, setDataEtour] = useState<eTourCustomer[]>([]); //* Lưu list eTour
    const [dataUpload, setDataUpload] = useState<ApiPassportResponse[]>([]); //* Lưu list upload
    // const [etourUpload, setEtourUpload] = useState<eTourCustomer[]>([]); //* Lưu list upload eTour
    const [totalGuest, setTotalGuest] = useState<ApiTotalResponse>({
        totalGuest: 0,
        etour: dataEtour,
        extract: dataExtract
    });

    const [activeComponent, setActiveComponent] = useState<"table" | "read">("table");

    // Loading
    const [loading, setLoading] = useState(false);
    const [loadingPassportUpload, setLoadingPassportUpload] = useState(false);

    // Checkbox update
    const [onlySelected, setOnlySelected] = useState(false);
    const [selectedPassports, setSelectedPassports] = useState<number[]>([]);

    //#region QR Code Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const qrCode = window.location.href;
    const qrCode = (() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("etour");
        return url.toString();
    })();

    const handleCopyUrl = async () => {
        const url = new URL(window.location.href);
        url.searchParams.delete("etour");
        const currentUrl = url.toString();
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
                setTotalGuest(response);

                if (response.dataExtract.length > 0) {
                    setActiveComponent("table");
                } else {
                    setActiveComponent("table");
                }
            } catch (error) {
                console.log("Error fetching passport data", error);
            } finally {
                setLoading(false);
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
        const currentUploads = dataUpload.length;
        const totalNewFiles = files.length;

        if (totalGuest.totalGuest !== 0 && (currentUploads + totalNewFiles > totalGuest.totalGuest)) {
            showToastMessage(`Bạn chỉ có thể upload tối đa ${totalGuest.totalGuest} ảnh theo số lượng eTour.`, "error");
            event.target.value = "";
            return;
        }
        try {
            setLoadingPassportUpload(true);
            const uploadFile = await fetchUploadApi(files, bookingId);
            setDataUpload((prevUpload) => [...prevUpload, ...uploadFile]);
            await savePassportDataApi(uploadFile);
            showToastMessage("Upload và lưu thành công!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPassportUpload(false);
        }
    }
    //#endregion

    //#region Save Passport Data & Update eTour
    // const handleSave = async () => {
    //     try {
    //         handleSaveTemp(dataUpload);
    //         await savePassportDataApi(dataUpload);
    //         showToastMessage("Lưu thành công!", "success");
    //         // setTimeout(() => {
    //         //     window.location.reload();
    //         // }, 1500);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    const handleSaveAndUpdateEtour = () => {
        if (onlySelected) {
            const selectedData = dataExtract.filter(passport =>
                selectedPassports.includes(passport.id as number)
            );
            const selectedMessage = { copyAll: JSON.stringify(selectedData, null, 2) };
            console.log("Dữ liệu được chọn", selectedMessage);
            window.parent.postMessage(selectedMessage, '*');
        } else {
            const filteredData = removeNullFields(dataExtract);
            const message = { copyAll: JSON.stringify(filteredData, null, 2) };
            console.log("Dữ liệu passport:", message)
            window.parent.postMessage(message, '*');
        }

        showToastMessage("Đang cập nhật dữ liệu...", "info");
    };


    // const handleSaveTemp = (updatedData: ApiPassportResponse[]) => {
    //     setDataUpload(updatedData);
    // };

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

    // const handleSaveEdit = async (id: number, updatedData: ApiPassportResponse[]) => {
    //     try {
    //         const result = await updatePassportDataApi(id, updatedData);
    //         console.log("Update result:", result);
    //         setDataExtract((prev) =>
    //             prev.map((item) =>
    //                 updatedData.some((updated) => updated.id === item.id)
    //                     ? { ...item, ...updatedData.find((updated) => updated.id === item.id) } : item));
    //     } catch (error) {
    //         console.error("Update fail:", error);
    //         showToastMessage("Cập nhật thất bại!", "error");
    //     }
    // };

    const handleSaveEdit = async (id: number, data: ApiPassportResponse[]) => {
        try {
            await updatePassportDataApi(id, data);
            showToastMessage("Cập nhật thành công! Vui lòng tải lại trang", "success");
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1500);
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };
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

    // const handleDeletePassportUpload = (index: number) => {
    //     setDataUpload((prevData) => prevData.filter((_, i) => i !== index));
    //     showToastMessage("Xóa thành công!", "success");
    // }
    //#endregion

    return (
        <>
            <div className="px-12 py-2">
                <div className="flex justify-between mb-4 gap-4 mobile:flex-col">
                    <div>
                        <button className="px-4 py-2 rounded-lg border border-solid border-black hover:text-white hover:bg-black hover:border-white transition-all duration-300 ease-in-out" onClick={QrCodeModalOpen}>
                            Hiển thị mã QR Code
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${activeComponent === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveComponent("table")}
                            disabled={loading}
                        >
                            So sánh dữ liệu với eTour
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${activeComponent === "read" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveComponent("read")}
                            disabled={loading}
                        >
                            Chỉnh sửa Passport
                        </button>
                    </div>
                    {/* <button
                            type="button"
                            className="py-2 px-4 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={QrCodeModalOpen}
                        >
                            Hiển thị mã QR Code
                        </button> */}
                </div>
                <hr />
                {/* <div className="w-full flex items-center justify-between mobile:flex-col mobile:space-y-8">
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
                            onChange={handleFileUpload}
                            accept="image/*"
                        />
                    </div>
                </div> */}
                {/* <div className="flex gap-2 mt-12 flex-col border-b border-solid border-black desktop:w-1/2 p-2.5 mobile:mt-4 mb-4 mobile:w-full">
                    <h1 className="font-semibold text-gray-900 uppercase">Ghi chú:</h1>
                    <div className="flex gap-12 mobile:flex-col mobile:gap-2">
                        <div className="flex items-center gap-4">
                            <div className="border border-solid border-gray-100 bg-cyan-200 p-2 rounded-full"></div>
                            <p>eTour</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="border border-solid border-gray-100 bg-green-300 p-2 rounded-full"></div>
                            <p className="text-balance">Dữ liệu đã lưu tạm thời</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>✅</div>
                            <p className="text-balance">Đã đối soát</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>❌</div>
                            <p className="text-balance">Chưa đối soát</p>
                        </div>
                    </div>
                </div> */}
                <div className="w-full mt-4">
                    {/* <PassportEtourTableLayout
                        formatDate={formatDate}
                        formatSex={formatSex}
                        loading={loading}
                        dataExtract={dataExtract}
                        dataEtour={dataEtour}
                        onDeletePassport={handleDeletePassport}
                        onSaveAndUpdateEtour={handleSaveAndUpdateEtour}
                        totalGuest={totalGuest}
                    /> */}

                    {loading ? (
                        <div className="flex flex-row justify-center gap-3 items-center">
                            <span className="pl-3">Đang tải dữ liệu...</span>
                            <Spinner aria-label="Spinner button example" size="sm" />
                        </div>
                    ) : activeComponent === "table" ? (
                        <TableLayoutNew
                            formatDate={formatDate}
                            formatSex={formatSex}
                            loading={loading}
                            dataExtract={dataExtract}
                            dataEtour={dataEtour}
                            onDeletePassport={handleDeletePassport}
                            onSaveAndUpdateEtour={handleSaveAndUpdateEtour}
                            totalGuest={totalGuest}
                            onSelectedPassportsChange={setSelectedPassports}
                            setOnlySelected={setOnlySelected}
                        />
                    ) : (
                        <React.Fragment>
                            <div className="flex justify-end">
                                <div className="mb-4 w-1/6 mobile:w-full tablet:w-full">
                                    <div>
                                        <Label htmlFor="multiple-file-upload" value="Đính kèm ảnh Passport" />
                                    </div>
                                    <FileInput
                                        id="multiple-file-upload"
                                        multiple
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                            <ReadPassportOnly
                                formatDate={formatDate}
                                formatSex={formatSex}
                                loading={loading}
                                loadingPassportUpload={loadingPassportUpload}
                                dataExtract={dataExtract}
                                dataUpload={dataUpload}
                                onDeletePassport={handleDeletePassport}
                                onSaveEdit={handleSaveEdit}
                            />
                        </React.Fragment>
                    )}
                </div>
                {/* <TableDemo
                    dataEtour={dataEtour}
                    dataExtract={dataExtract}
                /> */}
                {/* <div className="mt-4">
                    <PassportUpload
                        dataUpload={dataUpload}
                        formatDate={formatDate}
                        formatSex={formatSex}
                        loadingPassportUpload={loadingPassportUpload}
                        onSaveTemp={handleSaveTemp}
                        onDeletePassportUpload={handleDeletePassportUpload}
                        onSave={handleSave}
                    />
                </div> */}
            </div>
            {/* <ButtonFloatActionsMobile onSave={handleSave} onSaveAndUpdateEtour={handleSaveAndUpdateEtour} /> */}
            {/* <div className="mobile:hidden">
                <ButtonFloatActions onSave={handleSave} onSaveAndUpdateEtour={handleSaveAndUpdateEtour} />
            </div> */}
            <CopyLinkModal isOpen={isModalOpen} qrCode={qrCode} onClose={QrCodeModalClose} copyLink={handleCopyUrl} />
            {showToast && <CustomToast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
        </>
    );
}

export default TourPassportDashboard;