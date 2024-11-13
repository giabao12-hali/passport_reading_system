import React, { useState } from "react";
import { ApiPassportResponse } from "../../api/interfaces";
import RecylingBinIcon from "../icons/RecylingBin";
import ImageModal from "../UI/Modal/ImageModal";
import { Alert, Spinner, Table, Tooltip } from "flowbite-react";
import { Info } from "lucide-react";

interface PassportListProps {
    bookingId: string;
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    onDeleteShowToast: () => void;
    loadingListPassport: boolean;
    onDataExtractUpdate: (data: ApiPassportResponse[]) => void;
    dataExtract: ApiPassportResponse[];
    onDeletePassport: (id: number) => void;
}

const PassportList: React.FC<PassportListProps> = ({ formatDate, formatSex, loadingListPassport, dataExtract, onDeletePassport }) => {
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
    if (loadingListPassport) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="sm" />
            </div>
        )
    }
    if (!dataExtract.length)
        return (
            <div className="flex justify-center">Hiện tại không có dữ liệu</div>
        );
    //#endregion
    return (
        <div className="space-y-4" id="passport">
            <div className="flex justify-center items-center gap-2">
                <h1 className="font-semibold text-2xl text-center">Danh sách đã lưu</h1>
                <Tooltip content="Danh sách đã lưu từ hệ thống">
                    <Info className="size-5 text-cyan-500 translate-y-0.5" />
                </Tooltip>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Họ tên</Table.HeadCell>
                        <Table.HeadCell>Giới tính</Table.HeadCell>
                        <Table.HeadCell>Nơi sinh</Table.HeadCell>
                        <Table.HeadCell>Quốc tịch</Table.HeadCell>
                        <Table.HeadCell>Ngày sinh</Table.HeadCell>
                        <Table.HeadCell>Số Passport</Table.HeadCell>
                        <Table.HeadCell>Ngày cấp</Table.HeadCell>
                        <Table.HeadCell>Ngày hết hạn</Table.HeadCell>
                        <Table.HeadCell>Số CCCD/CMND</Table.HeadCell>
                        <Table.HeadCell>Ngày cấp</Table.HeadCell>
                        <Table.HeadCell>Ngày hết hạn</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    {dataExtract.map((passport, index) => (
                        <Table.Body className="divide-y" key={index}>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {passport.fullName ?? 'Chưa có thông tin'}
                                </Table.Cell>
                                <Table.Cell>{passport.sex !== undefined ? formatSex(passport.sex) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.placeOfBirth ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.nationality ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.passportNo ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.dateOfBirth ? formatDate(passport.dateOfBirth) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.dateOfIssue ? formatDate(passport.dateOfIssue) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                <Table.Cell>{passport.dateOfIssue ? formatDate(passport.dateOfIssue) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>
                                    <p
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 truncate cursor-pointer"
                                        onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}
                                    >
                                        Xem hình ảnh
                                    </p>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
                <ImageModal
                    isOpen={isModalOpen}
                    imageUrl={selectedImageUrl || ""}
                    onClose={closeModal}
                />
            </div>
            {/* <div className="flex justify-center flex-col gap-4">
                {dataExtract.map((passport, index) => (
                    <div key={index} className="block w-full p-6 bg-yellow-100 border border-gray-200 rounded-lg shadow-lg">
                        <div className="space-y-2.5">
                            <p className="font-bold text-gray-900">
                                Họ tên: {passport.fullName ?? "Chưa có thông tin"}
                            </p>
                            <p>Giới tính: {passport.sex !== undefined ? formatSex(passport.sex) : 'Chưa có thông tin'}</p>
                            <p>Nơi sinh: {passport.placeOfBirth ?? "Chưa có thông tin"}</p>
                            <p>Quốc tịch: {passport.nationality ?? "'Chưa có thông tin'"}</p>
                            <p>Ngày sinh: {passport.dateOfBirth ? formatDate(passport.dateOfBirth) : 'Chưa có thông tin'}</p>
                            <hr className="border-gray-300" />
                            <p className="font-bold text-gray-900">Số Passport: {passport.passportNo}</p>
                            <p>Ngày cấp: {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : 'Chưa có thông tin'}</p>
                            <p>Ngày hết hạn: {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : 'Chưa có thông tin'}</p>
                            <hr className="border-gray-300" />
                            <p className="font-bold text-gray-900">Số CCCD/CMND: {passport.idCardNo ?? "Chưa có thông tin"}</p>
                            <p>Ngày cấp: {passport.dateOfIssue ? formatDate(passport.dateOfIssue) : 'Chưa có thông tin'}</p>
                            <p>Ngày hết hạn: {passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : 'Chưa có thông tin'}</p>
                        </div>
                        <div className="my-4">
                            <Alert color="info" icon={Info}>
                                <span className="font-medium">Dữ liệu đang được lưu tạm thời</span>
                            </Alert>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <div>
                                <button
                                    type="button"
                                    className="bg-cyan-500 rounded-xl w-full h-12 px-4 flex items-center justify-center group hover:bg-cyan-600 font-semibold text-sm"
                                    onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}
                                >
                                    Xem hình ảnh
                                </button>
                            </div>
                            <div>
                                <Tooltip content="Xóa">
                                    <button
                                        type="button"
                                        className="group relative flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-xl bg-red-400 hover:bg-red-600"
                                        onClick={() => passport.id !== undefined && onDeletePassport(passport.id)}
                                    >
                                        <RecylingBinIcon />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ))}

            </div> */}
        </div>
    );
}

export default PassportList;