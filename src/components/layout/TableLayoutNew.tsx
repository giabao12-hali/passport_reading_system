import React, { useEffect, useRef, useState } from "react";
import { ApiPassportResponse, ApiTotalResponse, eTourCustomer } from "../../api/interfaces";
import { Alert, Button, Card, Checkbox, Label, Spinner, Table, Tooltip } from "flowbite-react";
import { Info, Image, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ImageModal from "../UI/Modal/ImageModal";

interface TableLayoutNewProps {
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loading: boolean;
    dataExtract: ApiPassportResponse[];
    dataEtour: eTourCustomer[];
    onDeletePassport: (id: number) => Promise<void>;
    onSaveAndUpdateEtour: () => void;
    totalGuest: ApiTotalResponse;
    onSelectedPassportsChange: (selectedIds: number[]) => void;
    setOnlySelected: (value: boolean) => void;
}

const TableLayoutNew: React.FC<TableLayoutNewProps> = ({ formatDate, formatSex, loading, dataExtract, dataEtour, onDeletePassport, onSaveAndUpdateEtour, totalGuest, onSelectedPassportsChange, setOnlySelected }) => {
    const noMatchPassport = useRef<HTMLDivElement | null>(null);

    //#region Checkbox
    const [selectedPassports, setSelectedPassports] = useState<number[]>([]);
    const handleCheckboxChange = (passportId: number, isChecked: boolean): void => {
        setSelectedPassports((prevSelected) =>
            isChecked
                ? [...prevSelected, passportId]
                : prevSelected.filter((id) => id !== passportId)
        );
        setOnlySelected(isChecked || selectedPassports.length > 0);
    };
    useEffect(() => {
        onSelectedPassportsChange(selectedPassports);
    }, [selectedPassports, onSelectedPassportsChange]);
    //#endregion


    //#region Modal open Passport Image
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);


    const handleViewImage = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageUrl(null);
    }
    //#endregion

    //#region Loading & Error
    if (loading) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="sm" />
            </div>
        )
    }
    //#endregion

    //#region Tính tổng
    const nonSimilarExtract = dataExtract.filter((passport) => passport.isSimilar === false).length;
    const currentTotalGuest = nonSimilarExtract + dataEtour.length;
    const isGuestLimitedExceed = totalGuest.totalGuest !== 0 && currentTotalGuest > totalGuest.totalGuest;
    //#endregion

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mobile:flex-col mobile:space-y-4 tablet:flex tablet:flex-col tablet:gap-4">
                <h3 className="font-semibold text-balance">Số lượng khách eTour: {totalGuest.totalGuest} khách</h3>
                {totalGuest.totalGuest !== 0 && isGuestLimitedExceed && (
                    <Alert color="red">
                        <div className="flex items-center gap-4">
                            <Info className="mobile:size-12" />
                            <span className="mobile:text-balance mobile:text-center">Danh sách khách chưa so sánh dữ liệu vượt quá mức số cho phép của số lượng khách eTour</span>
                        </div>
                    </Alert>
                )}
                <Button onClick={onSaveAndUpdateEtour} disabled={isGuestLimitedExceed && totalGuest.totalGuest !== 0}>
                    <p>
                        Cập nhật eTour
                    </p>
                </Button>
            </div>
            <div className="space-y-8 w-full">
                {dataEtour.map((etour, etourIndex) => (
                    <div key={etourIndex} className="flex justify-between gap-8 mobile:flex-col">
                        <div className="bg-green-100 w-1/2 p-4 rounded-lg shadow-lg border border-solid border-gray-900 border-opacity-10 space-y-4 mobile:w-full">
                            <h5 className="text-2xl font-bold">
                                Khách {etourIndex + 1}
                            </h5>
                            <div className="space-y-4">
                                <p className="font-bold">
                                    Họ tên:&nbsp;
                                    <span>{etour.fullName ?? "Chưa có thông tin"}</span>
                                </p>
                                <p>
                                    Giới tính:&nbsp;
                                    <span>
                                        {etour.sex !== undefined ? formatSex(etour.sex) : "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p>
                                    Địa chỉ:&nbsp;
                                    <span>
                                        {etour.address ?? "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p>
                                    Quốc tịch:&nbsp;
                                    <span>
                                        {etour.nationality ?? "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p className="font-bold">
                                    Số Passport:&nbsp;
                                    <span>
                                        {etour.passportNo ?? "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p>
                                    Ngày sinh:&nbsp;
                                    <span>
                                        {etour.dateOfBirth ? formatDate(etour.dateOfBirth) : "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p>
                                    Ngày cấp:&nbsp;
                                    <span>
                                        {etour.dateOfIssue ? formatDate(etour.dateOfIssue) : "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p>
                                    Ngày hết hạn:&nbsp;
                                    <span>
                                        {etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : "Chưa có thông tin"}
                                    </span>
                                </p>
                                <p className="font-bold">
                                    Số CCCD/CMND:&nbsp;
                                    <span>
                                        {etour.idCardNo ?? "Chưa có thông tin"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col mobile:w-full">
                            {dataExtract.filter((passport) => passport.isSimilar && passport.passportNo === etour.passportNo && etour.isSimilar)
                                .map((passport, mapIndex) => (
                                    <Card key={mapIndex} className="bg-yellow-100" >
                                        <div className="flex justify-between items-center">
                                            <h5 className="text-2xl font-bold">
                                                Khách {etourIndex + 1}
                                            </h5>
                                            <div className="flex items-center gap-2">
                                                <Checkbox id={`select-passport-${mapIndex}`} onChange={(e) => handleCheckboxChange(passport.id!, e.target.checked)} />
                                                <Label htmlFor="select-passport">Chọn</Label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mobile:flex mobile:flex-col tablet:flex tablet:flex-col">
                                            <div>
                                                <div className="space-y-4">
                                                    <p className="font-bold">
                                                        Họ tên:&nbsp;
                                                        <span
                                                            className={`font-bold ${passport.fullName !== etour.fullName ? "text-red-600 font-semibold" : "text-gray-900 dark:text-white"}`}
                                                        >
                                                            {passport.fullName ?? "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Giới tính:&nbsp;
                                                        <span
                                                            className={passport.sex !== etour.sex ? "text-red-600 font-semibold" : ""}
                                                        >
                                                            {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Địa chỉ:&nbsp;
                                                        <span
                                                            className={passport.address !== etour.address ? "text-red-600 font-semibold" : ""}
                                                        >
                                                            {passport.address ?? "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Quốc tịch:&nbsp;
                                                        <span
                                                            className={passport.nationality !== etour.nationality ? "text-red-500" : ""}
                                                        >
                                                            {passport.nationality ?? "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p className="font-bold">
                                                        Số Passport:&nbsp;
                                                        <span
                                                            className={`font-bold ${passport.passportNo !== etour.passportNo ? "text-red-600 font-semibold" : "text-gray-900 dark:text-white"}`}
                                                        >
                                                            {passport.passportNo ?? "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Ngày sinh:&nbsp;
                                                        <span
                                                            className={passport.dateOfBirth !== etour.dateOfBirth ? "text-red-600 font-semibold" : ""}
                                                        >
                                                            {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Ngày cấp:&nbsp;
                                                        <span
                                                            className={passport.dateOfIssue !== etour.dateOfIssue ? "text-red-600 font-semibold" : ""}
                                                        >
                                                            {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Ngày hết hạn:&nbsp;
                                                        <span
                                                            className={passport.dateOfExpiry !== etour.dateOfExpiry ? "text-red-600 font-semibold" : ""}
                                                        >
                                                            {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <p className="font-bold">
                                                        Số CCCD/CMND:&nbsp;
                                                        <span
                                                            className={`font-bold ${passport.idCardNo !== etour.idCardNo ? "text-red-600 font-semibold" : "text-gray-900 dark:text-white"}`}
                                                        >
                                                            {passport.idCardNo ?? "Chưa có thông tin"}
                                                        </span>
                                                    </p>
                                                    <div className="border border-solid border-gray-900 opacity-10"></div>
                                                    <div className="flex justify-end items-center gap-4">

                                                        <Tooltip content="Xóa">
                                                            <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                                Xóa
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <img src={passport.imageUrl} alt={passport.fullName} className="rounded-lg" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <div className="w-full space-y-4" id="noMatchPassport" ref={noMatchPassport}>
                <h1 className="text-2xl text-center text-balance font-bold">
                    Các Passport không trùng khớp với dữ liệu eTour
                </h1>
                <div className="overflow-x-auto max-h-96 overflow-y-auto mobile:max-w-sm">
                    <Table striped>
                        <Table.Head className="sticky top-0">
                            <Table.HeadCell className=" text-black">STT</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Họ tên</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Giới tính</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Địa chỉ</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Quốc tịch</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Ngày sinh</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Số Passport</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Ngày cấp</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Ngày hết hạn</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Số CCCD/CMND</Table.HeadCell>
                            <Table.HeadCell className=" text-black">Chức năng</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {dataExtract
                                .filter((passport) => !passport.isSimilar)
                                .map((passport, index) => (
                                    <Table.Row key={index} >
                                        <Table.Cell className="text-lg font-bold">{dataEtour.length + index + 1}</Table.Cell>
                                        <Table.Cell className="font-bold text-gray-900 dark:text-white">{passport.fullName ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content={passport.address}>
                                                {passport.address ?? "Chưa có thông tin"}
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>{passport.nationality ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="font-bold">{passport.passportNo ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="font-bold">{passport.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-2">
                                                <Tooltip content="Xem hình ảnh">
                                                    <button onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)} className="px-4 py-3 bg-blue-500 hover:bg-blue-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                        <Image className="text-white" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Xóa">
                                                    <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                        <Trash2 className="text-white" />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <ImageModal
                isOpen={isModalOpen}
                imageUrl={selectedImageUrl || ""}
                onClose={closeModal}
            />
            <div className="fixed flex flex-col items-end gap-2 top-[80%] mobile:top-2/3 tablet:top-2/3 right-0 z-10 mr-12">
                <Tooltip content="Trở lên đầu trang">
                    <button
                        onClick={() => {
                            window.scroll({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}
                        className="bg-cyan-500 p-2.5 rounded-full text-white text-sm w-full opacity-90 animate-bounce"
                    >
                        <ChevronUp />
                    </button>
                </Tooltip>
                <Tooltip content="Danh sách passport không trùng khớp">
                    <button
                        onClick={() => {
                            noMatchPassport.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-cyan-500 p-2.5 rounded-full text-white text-sm w-full opacity-90 animate-bounce"
                    >
                        <ChevronDown />
                    </button>
                </Tooltip>
            </div>
            {/* {dataExtract.filter((passport) => !passport.isSimilar)
                .map((passport, index) => (
                    <Card className="bg-yellow-100 w-1/2" key={index}>
                        <h5 className="text-2xl font-bold">
                            Khách {index + 1}
                        </h5>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="space-y-4">
                                    <p className="font-bold">
                                        Họ tên:&nbsp;
                                        <span>{passport.fullName ?? "Chưa có thông tin"}</span>
                                    </p>
                                    <p>
                                        Giới tính:&nbsp;
                                        <span>
                                            {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p>
                                        Địa chỉ:&nbsp;
                                        <span>
                                            {passport.address ?? "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p>
                                        Quốc tịch:&nbsp;
                                        <span>
                                            {passport.nationality ?? "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p className="font-bold">
                                        Số Passport:&nbsp;
                                        <span>
                                            {passport.passportNo ?? "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p>
                                        Ngày sinh:&nbsp;
                                        <span>
                                            {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p>
                                        Ngày cấp:&nbsp;
                                        <span>
                                            {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p>
                                        Ngày hết hạn:&nbsp;
                                        <span>
                                            {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <p className="font-bold">
                                        Số CCCD/CMND:&nbsp;
                                        <span>
                                            {passport.idCardNo ?? "Chưa có thông tin"}
                                        </span>
                                    </p>
                                    <div className="border border-solid border-gray-900 opacity-10"></div>
                                    <div className="flex justify-end items-center gap-4">
                                        <Tooltip content="Xóa">
                                            <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                Xóa
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <Alert color="red">
                                    <div className="flex items-center gap-4">
                                        <X />
                                        <span>Danh sách dữ liệu chưa so sánh</span>
                                    </div>
                                </Alert>
                            </div>
                            <div className="col-span-2">
                                <img src={passport.imageUrl} alt={passport.fullName} className="rounded-lg" />
                            </div>
                        </div>

                    </Card>
                ))} */}
            {/* <div className="grid grid-cols-2 gap-4">
                <div id="etour">
                    <div className="mb-4">
                        <h1 className="font-bold text-xl text-black text-center">Thông tin eTour</h1>
                    </div>
                    <div className="space-y-8">
                        {dataEtour.map((etour, index) => (
                            <div key={index} className="flex">
                                <Card className="bg-green-100">
                                    <h5 className="text-2xl font-bold">
                                        Khách {index + 1}
                                    </h5>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-4">
                                            <p className="font-bold">
                                                Họ tên:&nbsp;
                                                <span>{etour.fullName ?? "Chưa có thông tin"}</span>
                                            </p>
                                            <p>
                                                Giới tính:&nbsp;
                                                <span>
                                                    {etour.sex !== undefined ? formatSex(etour.sex) : "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p>
                                                Địa chỉ:&nbsp;
                                                <span>
                                                    {etour.address ?? "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p>
                                                Quốc tịch:&nbsp;
                                                <span>
                                                    {etour.nationality ?? "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p className="font-bold">
                                                Số Passport:&nbsp;
                                                <span>
                                                    {etour.passportNo ?? "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p>
                                                Ngày sinh:&nbsp;
                                                <span>
                                                    {etour.dateOfBirth ? formatDate(etour.dateOfBirth) : "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p>
                                                Ngày cấp:&nbsp;
                                                <span>
                                                    {etour.dateOfIssue ? formatDate(etour.dateOfIssue) : "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p>
                                                Ngày hết hạn:&nbsp;
                                                <span>
                                                    {etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : "Chưa có thông tin"}
                                                </span>
                                            </p>
                                            <p className="font-bold">
                                                Số CCCD/CMND:&nbsp;
                                                <span>
                                                    {etour.idCardNo ?? "Chưa có thông tin"}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="col-span-2">
                                                <img src={etour.imageUrl} alt={etour.fullName} className="rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                {dataExtract.filter((passport) => passport.isSimilar && passport.passportNo === etour.passportNo)
                                    .map((passport, index) => (
                                        <div key={index}>
                                            <div className="space-y-4">
                                                <p className="font-bold">
                                                    Họ tên:&nbsp;
                                                    <span>{passport.fullName ?? "Chưa có thông tin"}</span>
                                                </p>
                                                <p>
                                                    Giới tính:&nbsp;
                                                    <span>
                                                        {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Địa chỉ:&nbsp;
                                                    <span>
                                                        {passport.address ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Quốc tịch:&nbsp;
                                                    <span>
                                                        {passport.nationality ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số Passport:&nbsp;
                                                    <span>
                                                        {passport.passportNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày sinh:&nbsp;
                                                    <span>
                                                        {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày cấp:&nbsp;
                                                    <span>
                                                        {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày hết hạn:&nbsp;
                                                    <span>
                                                        {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số CCCD/CMND:&nbsp;
                                                    <span>
                                                        {passport.idCardNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <div className="border border-solid border-gray-900 opacity-10"></div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <Tooltip content="Xóa">
                                                        <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                            Xóa
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div id="extract">
                    <div className="mb-4">
                        <h1 className="font-bold text-xl text-black text-center">Thông tin passport</h1>
                    </div>
                    <div className="space-y-8">
                        {dataExtract.filter((passport) => passport.isSimilar && passport.passportNo === dataEtour[0].passportNo)
                            .map((passport, mapIndex) => (
                                <React.Fragment key={mapIndex}>
                                    <Card className="bg-yellow-100">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-2xl font-bold">
                                                Khách {mapIndex + 1}
                                            </h5>
                                            <div>
                                                <Alert color="success">
                                                    <div className="flex items-center gap-4">
                                                        <Check />
                                                        <span>Khách đã so sánh dữ liệu với eTour</span>
                                                    </div>
                                                </Alert>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-4">
                                                <p className="font-bold">
                                                    Họ tên:&nbsp;
                                                    <span>{passport.fullName ?? "Chưa có thông tin"}</span>
                                                </p>
                                                <p>
                                                    Giới tính:&nbsp;
                                                    <span>
                                                        {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Địa chỉ:&nbsp;
                                                    <span>
                                                        {passport.address ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Quốc tịch:&nbsp;
                                                    <span>
                                                        {passport.nationality ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số Passport:&nbsp;
                                                    <span>
                                                        {passport.passportNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày sinh:&nbsp;
                                                    <span>
                                                        {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày cấp:&nbsp;
                                                    <span>
                                                        {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày hết hạn:&nbsp;
                                                    <span>
                                                        {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số CCCD/CMND:&nbsp;
                                                    <span>
                                                        {passport.idCardNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <div className="border border-solid border-gray-900 opacity-10"></div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <Tooltip content="Xóa">
                                                        <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                            Xóa
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <img src={passport.imageUrl} alt={passport.fullName} className="rounded-md" />
                                            </div>
                                        </div>

                                    </Card>
                                </React.Fragment>
                            ))}
                        {dataExtract.filter((passport) => !passport.isSimilar)
                            .map((passport, index) => (
                                <React.Fragment key={index}>
                                    <Card className="bg-yellow-100">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-2xl font-bold">
                                                Khách {index + 1}
                                            </h5>
                                            <div>
                                                <Alert color="red">
                                                    <div className="flex items-center gap-4">
                                                        <X />
                                                        <span>Khách chưa đối soát dữ liệu với eTour</span>
                                                    </div>
                                                </Alert>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-4">
                                                <p className="font-bold">
                                                    Họ tên:&nbsp;
                                                    <span>{passport.fullName ?? "Chưa có thông tin"}</span>
                                                </p>
                                                <p>
                                                    Giới tính:&nbsp;
                                                    <span>
                                                        {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Địa chỉ:&nbsp;
                                                    <span>
                                                        {passport.address ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Quốc tịch:&nbsp;
                                                    <span>
                                                        {passport.nationality ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số Passport:&nbsp;
                                                    <span>
                                                        {passport.passportNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày sinh:&nbsp;
                                                    <span>
                                                        {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày cấp:&nbsp;
                                                    <span>
                                                        {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p>
                                                    Ngày hết hạn:&nbsp;
                                                    <span>
                                                        {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <p className="font-bold">
                                                    Số CCCD/CMND:&nbsp;
                                                    <span>
                                                        {passport.idCardNo ?? "Chưa có thông tin"}
                                                    </span>
                                                </p>
                                                <div className="border border-solid border-gray-900 opacity-10"></div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <Tooltip content="Xóa">
                                                        <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)} className="px-4 py-3 bg-red-500 hover:bg-red-700 hover:transition-all hover:duration-300 hover:ease-in-out rounded-xl">
                                                            Xóa
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <img src={passport.imageUrl} alt={passport.fullName} className="rounded-md" />
                                            </div>
                                        </div>

                                    </Card>
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            </div> */}
            {/* <div className="grid grid-cols-2 gap-4">
                <div id="etour">
                    <div className="mb-4">
                        <h1 className="font-bold text-xl text-black text-center">Thông tin eTour</h1>
                    </div>
                    <div className="space-y-24">
                        {dataEtour.length > 0 ? (
                            dataEtour.map((etour, index) => (
                                <div key={index}>
                                    <Card>
                                        <h5 className="text-2xl font-bold">
                                            Khách {index + 1}
                                        </h5>
                                        <p className="font-bold">
                                            Họ tên:&nbsp;
                                            <span>{etour.fullName ?? "Chưa có thông tin"}</span>
                                        </p>
                                        <p>
                                            Giới tính:&nbsp;
                                            <span>
                                                {etour.sex !== undefined ? formatSex(etour.sex) : "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p>
                                            Địa chỉ:&nbsp;
                                            <span>
                                                {etour.address ?? "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p>
                                            Quốc tịch:&nbsp;
                                            <span>
                                                {etour.nationality ?? "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p className="font-bold">
                                            Số Passport:&nbsp;
                                            <span>
                                                {etour.passportNo ?? "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p>
                                            Ngày sinh:&nbsp;
                                            <span>
                                                {etour.dateOfBirth ? formatDate(etour.dateOfBirth) : "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p>
                                            Ngày cấp:&nbsp;
                                            <span>
                                                {etour.dateOfIssue ? formatDate(etour.dateOfIssue) : "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p>
                                            Ngày hết hạn:&nbsp;
                                            <span>
                                                {etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : "Chưa có thông tin"}
                                            </span>
                                        </p>
                                        <p className="font-bold">
                                            Số CCCD/CMND:&nbsp;
                                            <span>
                                                {etour.idCardNo ?? "Chưa có thông tin"}
                                            </span>
                                        </p>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <>
                                <p className="text-center">Không có dữ liệu</p>
                            </>
                        )}
                    </div>
                </div>

            </div> */}
        </div>
    );
}

export default TableLayoutNew;