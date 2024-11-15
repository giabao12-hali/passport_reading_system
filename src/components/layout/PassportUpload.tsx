import React, { useEffect, useState } from "react";
import { ApiPassportResponse } from "../../api/interfaces";
import ImageModal from "../UI/Modal/ImageModal";
import { Info, Trash2, Image, Save, X, RotateCw, Edit, IdCard, User, MapPin, Earth, TicketsPlane } from "lucide-react";
import { Button, Spinner, Table, Tooltip } from "flowbite-react";
import InputWithIcon from "../icons/InputWithIcon";

interface PassportUploadProps {
    dataUpload: ApiPassportResponse[];
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loadingPassportUpload: boolean
    onDeletePassportUpload: (index: number) => void;
    onSaveTemp: (updatedData: ApiPassportResponse[]) => void;
    onSave: () => void;
}

const PassportUpload: React.FC<PassportUploadProps> = ({ dataUpload, formatDate, formatSex, loadingPassportUpload, onSaveTemp, onDeletePassportUpload, onSave }) => {

    //#region Editing Fields
    const [editedData, setEditedData] = useState<ApiPassportResponse[]>([]);
    const [editRows, setEditRows] = useState<Set<number>>(new Set());

    useEffect(() => {
        setEditedData(dataUpload);
    }, [dataUpload]);

    // Enable editing for all rows
    const enableEdit = (index: number) => {
        const newEditRows = new Set(editRows);
        newEditRows.add(index);
        setEditRows(newEditRows);
    };

    // Save edited data and exit edit mode
    const saveEdit = (index: number) => {
        const newEditRows = new Set(editRows);
        newEditRows.delete(index);
        setEditRows(newEditRows);
        onSaveTemp(editedData);
    };

    // Reset edited data to original
    const resetEdit = (index: number) => {
        const newEditedData = [...editedData];
        newEditedData[index] = { ...dataUpload[index] };
        setEditedData(newEditedData);
    };

    // Cancel editing mode without saving
    const cancelEdit = (index: number) => {
        const newEditRows = new Set(editRows);
        newEditRows.delete(index);  // Xóa hàng khỏi chế độ chỉnh sửa
        setEditRows(newEditRows);

        // Khôi phục dữ liệu gốc từ `dataUpload` vào `editedData`
        const newEditedData = [...editedData];
        newEditedData[index] = { ...dataUpload[index] };
        setEditedData(newEditedData);
    };

    const handleInputChange = (index: number, field: keyof ApiPassportResponse, value: string | boolean) => {
        const updatedData = [...editedData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setEditedData(updatedData);
    };

    const handleDateInputChange = (index: number, field: keyof ApiPassportResponse, value: string) => {
        const updatedData = [...editedData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setEditedData(updatedData);
    };
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
    if (loadingPassportUpload) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="md" />
            </div>
        )
    }
    if (!dataUpload.length)
        return (
            <div className="flex justify-center">Hiện tại không có dữ liệu</div>
        );
    //#endregion

    return (
        <div className="space-y-4 w-full" id="passport">
            <div className="flex justify-center items-center gap-2">
                <h1 className="font-semibold text-2xl text-center">Danh sách upload</h1>
                <Tooltip content="Danh sách upload passport">
                    <Info className="size-5 text-cyan-500 translate-y-0.5" />
                </Tooltip>
            </div>
            <div className="flex items-center justify-end">
                <Button onClick={onSave} color="success">
                    <p>
                        Lưu tạm
                    </p>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell className="bg-yellow-100 text-black">STT</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Họ tên</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Giới tính</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Địa chỉ</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Quốc tịch</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Ngày sinh</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Số Passport</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Ngày cấp</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Ngày hết hạn</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Số CCCD/CMND</Table.HeadCell>
                        <Table.HeadCell className="bg-yellow-100 text-black">Chức năng</Table.HeadCell>
                    </Table.Head>

                    <Table.Body>
                        {editedData.map((passport, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <InputWithIcon
                                            Icon={<User />}
                                            placeholder="Họ tên"
                                            inputType="text"
                                            inputName="fullName"
                                            value={passport.fullName ?? ""}
                                            onChange={(e) => handleInputChange(index, "fullName", e.target.value)}
                                        />
                                    ) : (
                                        passport.fullName ?? "Chưa có thông tin"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <select
                                            value={passport.sex ? "Nam" : "Nữ"}
                                            onChange={(e) => handleInputChange(index, "sex", e.target.value === "Nam" ? true : false)}
                                            className="input rounded-md text-gray-900"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    ) : (
                                        formatSex(passport.sex ?? true)
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <InputWithIcon
                                            Icon={<MapPin />}
                                            placeholder="Nơi sinh"
                                            inputType="text"
                                            inputName="address"
                                            value={passport.address ?? ""}
                                            onChange={(e) => handleInputChange(index, "address", e.target.value)}
                                        />
                                    ) : (
                                        passport.address ?? "Chưa có thông tin"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <InputWithIcon
                                            Icon={<Earth />}
                                            placeholder="Quốc tịch"
                                            inputType="text"
                                            inputName="nationality"
                                            value={passport.nationality ?? ""}
                                            onChange={(e) => handleInputChange(index, "nationality", e.target.value)}
                                        />
                                    ) : (
                                        passport.nationality ?? "Chưa có thông tin"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <input
                                            type="date"
                                            value={passport.dateOfBirth ?? ""}
                                            onChange={(e) => handleDateInputChange(index, "dateOfBirth", e.target.value)}
                                            className="input rounded-md"
                                        />
                                    ) : (
                                        formatDate(passport.dateOfBirth ?? "")
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <InputWithIcon
                                            Icon={<TicketsPlane />}
                                            placeholder="Số Passport"
                                            inputType="text"
                                            inputName="passportNo"
                                            value={passport.passportNo ?? ""}
                                            onChange={(e) => handleInputChange(index, "passportNo", e.target.value)}
                                        />
                                    ) : (
                                        passport.passportNo ?? "Chưa có thông tin"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <input
                                            type="date"
                                            value={passport.dateOfIssue ?? ""}
                                            onChange={(e) => handleDateInputChange(index, "dateOfIssue", e.target.value)}
                                            className="input rounded-md"
                                        />
                                    ) : (
                                        formatDate(passport.dateOfIssue ?? "")
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <input
                                            type="date"
                                            value={passport.dateOfExpiry ?? ""}
                                            onChange={(e) => handleDateInputChange(index, "dateOfExpiry", e.target.value)}
                                            className="input rounded-md"
                                        />
                                    ) : (
                                        formatDate(passport.dateOfExpiry ?? "")
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {editRows.has(index) ? (
                                        <InputWithIcon
                                            Icon={<IdCard />}
                                            placeholder="Số CCCD/CMND"
                                            inputType="text"
                                            inputName="idCardNo"
                                            value={passport.idCardNo ?? ""}
                                            onChange={(e) => handleInputChange(index, "idCardNo", e.target.value)}
                                            className=""
                                        />
                                    ) : (
                                        passport.idCardNo ?? "Chưa có thông tin"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-2">
                                        {editRows.has(index) ? (
                                            <>
                                                <Tooltip content="Lưu">
                                                    <button type="button" onClick={() => saveEdit(index)}>
                                                        <Save className="text-green-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Hủy">
                                                    <button type="button" onClick={() => cancelEdit(index)}>
                                                        <X className="text-red-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Reset">
                                                    <button type="button" onClick={() => resetEdit(index)}>
                                                        <RotateCw className="text-yellow-500" />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip content="Chỉnh sửa">
                                                    <button type="button" onClick={() => enableEdit(index)}>
                                                        <Edit className="text-blue-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Xem hình ảnh">
                                                    <button type="button" onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}>
                                                        <Image className="text-cyan-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Xóa">
                                                    <button
                                                        onClick={() => onDeletePassportUpload(index)}
                                                    >
                                                        <Trash2 className="text-red-500" />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <ImageModal isOpen={isModalOpen} imageUrl={selectedImageUrl || ""} onClose={closeModal} />
            </div>
        </div>
    );
}

export default PassportUpload;