import React, { useState } from "react";
import { ApiPassportResponse, ApiTotalResponse, eTourCustomer } from "../../api/interfaces";
import { Alert, Badge, Button, Card, Spinner, Table, Tooltip } from "flowbite-react";
import { Image, Info, Trash2 } from "lucide-react";

interface TableLayoutNewProps {
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loading: boolean;
    dataExtract: ApiPassportResponse[];
    dataEtour: eTourCustomer[];
    onDeletePassport: (id: number) => Promise<void>;
    onSaveAndUpdateEtour: () => void;
    totalGuest: ApiTotalResponse;
}

const TableLayoutNew: React.FC<TableLayoutNewProps> = ({ formatDate, formatSex, loading, dataExtract, dataEtour, onDeletePassport, onSaveAndUpdateEtour, totalGuest }) => {
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
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-balance">Số lượng khách eTour: {totalGuest.totalGuest} khách</h3>
                {totalGuest.totalGuest !== 0 && isGuestLimitedExceed && (
                    <Alert color="red">
                        <div className="flex items-center gap-4">
                            <Info />
                            <span>Danh sách khách chưa đối soát vượt quá mức số cho phép của số lượng khách eTour</span>
                        </div>
                    </Alert>
                )}
                <Button onClick={onSaveAndUpdateEtour} disabled={isGuestLimitedExceed && totalGuest.totalGuest !== 0}>
                    <p>
                        Cập nhật eTour
                    </p>
                </Button>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
                <div id="etour">
                    <h1 className="font-bold text-xl text-black text-center">Thông tin eTour</h1>
                    {dataEtour.length > 0 ? (
                        dataEtour.map((etour, index) => (
                            <React.Fragment key={index}>
                                <Card>
                                    <h5 className="text-2xl font-bold">
                                        Khách {index + 1}
                                    </h5>
                                    <p className="font-semibold">
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
                                    <p>
                                        Số CCCD/CMND:&nbsp;
                                        <span>
                                            {etour.idCardNo ?? "Chưa có thông tin"}
                                        </span>
                                    </p>
                                </Card>
                                {dataExtract.filter((passport) => passport.isSimilar && passport.passportNo === etour.passportNo)
                                    .map((passport, mapIndex) => (
                                        <Card key={mapIndex}>
                                            <h5 className="text-2xl font-bold">
                                                Khách {mapIndex + 1}
                                            </h5>
                                            <p className="font-semibold">
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
                                            <p>
                                                Số CCCD/CMND:&nbsp;
                                                <span>
                                                    {passport.idCardNo ?? "Chưa có thông tin"}
                                                </span>
                                            </p>
                                        </Card>
                                    ))}
                            </React.Fragment>

                        ))
                    ) : (
                        <>
                            <p className="text-center">Không có dữ liệu</p>
                        </>
                    )}
                </div>
                <div id="extract"></div>
            </div> */}
        </div>
    );
}

export default TableLayoutNew;