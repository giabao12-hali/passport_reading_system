import React, { useState } from "react";
import { ApiPassportResponse, ApiTotalResponse, eTourCustomer } from "../../api/interfaces";
import { Alert, Badge, Button, Spinner, Table, Tooltip } from "flowbite-react";
import { Image, Info, Trash2 } from "lucide-react";
import ImageModal from "../UI/Modal/ImageModal";

interface PassportEtourTableLayoutProps {
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loading: boolean;
    dataExtract: ApiPassportResponse[];
    dataEtour: eTourCustomer[];
    onDeletePassport: (id: number) => Promise<void>;
    onSaveAndUpdateEtour: () => void;
    totalGuest: ApiTotalResponse;
}

const PassportEtourTableLayout: React.FC<PassportEtourTableLayoutProps> = ({ formatDate, formatSex, loading, dataExtract, dataEtour, onDeletePassport, onSaveAndUpdateEtour, totalGuest }) => {
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
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <Table striped>
                    <Table.Head className="sticky top-0">
                        <Table.HeadCell className=" text-black">STT</Table.HeadCell>
                        <Table.HeadCell className=" text-black">Loại dữ liệu</Table.HeadCell>
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
                        {dataEtour.length > 0 ? (
                            dataEtour.map((etour, etourIndex) => (
                                <React.Fragment key={etourIndex}>
                                    <Table.Row className="bg-cyan-50 text-gray-900">
                                        <Table.Cell className="text-lg font-bold">{etourIndex + 1}</Table.Cell>
                                        <Table.Cell className="font-bold text-cyan-600">
                                            <Badge color="info">
                                                eTour
                                                {etour.isSimilar ? (
                                                    <span className="text-green-500 ml-2">✅</span>
                                                ) : (
                                                    <span className="text-red-500 ml-2">❌</span>
                                                )}
                                            </Badge>

                                        </Table.Cell>
                                        <Table.Cell className="font-bold">{etour.fullName ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="">{etour.sex !== undefined ? formatSex(etour.sex) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="">
                                            <Tooltip content={etour.address}>
                                                <p className="truncate max-w-28">
                                                    {etour.address ?? "Chưa có thông tin"}
                                                </p>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>{etour.nationality ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{etour.dateOfBirth ? formatDate(etour.dateOfBirth) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="font-bold">{etour.passportNo ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{etour.dateOfIssue ? formatDate(etour.dateOfIssue) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>{etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell className="font-bold">{etour.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>

                                    {dataExtract
                                        .filter((passport) => passport.isSimilar && passport.passportNo === etour.passportNo)
                                        .map((passport, extractIndex) => (
                                            <Table.Row key={extractIndex} className="bg-green-100 text-gray-900">
                                                <Table.Cell className="text-lg font-bold">{etourIndex + 1}</Table.Cell>
                                                <Table.Cell className="font-bold">
                                                    <Badge color="success">
                                                        Trích xuất
                                                        {passport.isSimilar ? (
                                                            <span className="text-green-500 ml-2">✅</span>
                                                        ) : (
                                                            <span className="text-red-500 ml-2">❌</span>
                                                        )}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={`font-bold ${passport.fullName !== etour.fullName ? "text-red-600 font-semibold" : "text-gray-900 dark:text-white"}`}
                                                >
                                                    {passport.fullName ?? "Chưa có thông tin"}

                                                </Table.Cell>
                                                <Table.Cell
                                                    className={passport.sex !== etour.sex ? "text-red-600 font-semibold" : ""}
                                                >
                                                    {passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={passport.address !== etour.address ? "text-red-600 font-semibold" : ""}
                                                >
                                                    <Tooltip content={passport.address}>
                                                        <p className="truncate max-w-28">
                                                            {passport.address ?? "Chưa có thông tin"}
                                                        </p>
                                                    </Tooltip>
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={passport.nationality !== etour.nationality ? "text-red-500" : ""}
                                                >
                                                    {passport.nationality ?? "Chưa có thông tin"}
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={passport.dateOfBirth !== etour.dateOfBirth ? "text-red-600 font-semibold" : ""}
                                                >
                                                    {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={`font-bold ${passport.passportNo !== etour.passportNo} ? "text-red-600 font-semibold" : ""`}
                                                >
                                                    {passport.passportNo ?? "Chưa có thông tin"}
                                                </Table.Cell>
                                                <Table.Cell
                                                    className={passport.dateOfIssue !== etour.dateOfIssue ? "text-red-600 font-semibold" : ""}
                                                >{passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}</Table.Cell>
                                                <Table.Cell
                                                    className={passport.dateOfExpiry !== etour.dateOfExpiry ? "text-red-600 font-semibold" : ""}
                                                >{passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}</Table.Cell>
                                                <Table.Cell
                                                    className={`font-bold ${passport.idCardNo !== etour.idCardNo} ? "text-red-600 font-semibold" : ""`}
                                                >{passport.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip content="Xem hình ảnh">
                                                            <button onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}>
                                                                <Image className="text-cyan-500 hover:text-cyan-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip content="Xóa">
                                                            <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)}>
                                                                <Trash2 className="text-red-500 hover:text-red-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={12} className="text-center uppercase font-semibold">
                                    Không có dữ liệu từ etour
                                </Table.Cell>
                            </Table.Row>
                        )}

                        {dataExtract
                            .filter((passport) => !passport.isSimilar)
                            .map((passport, index) => (
                                <Table.Row key={index} className="bg-yellow-100 text-gray-900">
                                    <Table.Cell className="text-lg font-bold">{dataEtour.length + index + 1}</Table.Cell>
                                    <Table.Cell className="font-bold">
                                        <Badge color="success">
                                            Trích xuất
                                            {passport.isSimilar ? (
                                                <span className="text-green-500 ml-2">✅</span>
                                            ) : (
                                                <span className="text-red-500 ml-2">❌</span>
                                            )}
                                        </Badge>
                                    </Table.Cell>
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
                                                <button onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}>
                                                    <Image className="text-cyan-500 hover:text-cyan-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip content="Xóa">
                                                <button onClick={() => passport.id !== undefined && onDeletePassport(passport.id)}>
                                                    <Trash2 className="text-red-500 hover:text-red-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                <ImageModal
                    isOpen={isModalOpen}
                    imageUrl={selectedImageUrl || ""}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}

export default PassportEtourTableLayout;