import React, { useEffect, useState } from "react";
import { ApiPassportResponse } from "../../api/interfaces";
import ImageModal from "../UI/Modal/ImageModal";
import { Info, Trash2, Image, Save, X, RotateCw, Edit, IdCard, User, MapPin, Earth, TicketsPlane } from "lucide-react";
import { Spinner, Table, Tooltip } from "flowbite-react";
import InputWithIcon from "../icons/InputWithIcon";

interface PassportUploadProps {
    dataUpload: ApiPassportResponse[];
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loadingPassportUpload: boolean
    onDeletePassportUpload: (index: number) => void;
    onSaveTemp: (updatedData: ApiPassportResponse[]) => void;
}

const PassportUpload: React.FC<PassportUploadProps> = ({ dataUpload, formatDate, formatSex, loadingPassportUpload, onSaveTemp, onDeletePassportUpload }) => {

    //#region Editing Fields
    const [editedData, setEditedData] = useState<ApiPassportResponse[]>([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditedData(dataUpload);
    }, [dataUpload]);

    // Enable editing for all rows
    const enableEdit = () => setEditMode(true);

    // Save edited data and exit edit mode
    const saveEdit = () => {
        setEditMode(false);
        onSaveTemp(editedData);  // Send the edited data to parent component
    };

    // Reset edited data to original
    const resetEdit = () => setEditedData(dataUpload);

    // Cancel editing mode without saving
    const cancelEdit = () => {
        setEditMode(false);
        setEditedData(dataUpload);  // Reset to initial state
    };

    const handleInputChange = (index: number, field: keyof ApiPassportResponse, value: string | boolean) => {
        const updatedData = [...editedData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setEditedData(updatedData);
    };
    const handleDateInputChange = (index: number, field: keyof ApiPassportResponse, value: string) => {
        const updatedData = [...editedData];
        updatedData[index] = {
            ...updatedData[index],
            [field]: value
        };
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                    {editMode ? (
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
                                        {editMode ? (
                                            <>
                                                <Tooltip content="Lưu">
                                                    <button type="button" onClick={saveEdit}>
                                                        <Save className="text-green-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Hủy">
                                                    <button type="button" onClick={cancelEdit}>
                                                        <X className="text-red-500" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content="Reset">
                                                    <button type="button" onClick={resetEdit}>
                                                        <RotateCw className="text-yellow-500" />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip content="Chỉnh sửa">
                                                    <button type="button" onClick={enableEdit}>
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
                        {/* {dataUpload.length > 0 ? (
                            dataUpload.map((passport, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell className="font-bold text-gray-900 dark:text-white">
                                        {passport.fullName ?? "Chưa có thông tin"}
                                    </Table.Cell>
                                    <Table.Cell>{passport.sex !== undefined ? formatSex(passport.sex) : "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.placeOfBirth ?? "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.nationality ?? "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.dateOfBirth ? formatDate(passport.dateOfBirth) : "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.passportNo ?? "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.dateOfIssue ? formatDate(passport.dateOfIssue) : "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.dateOfExpiry ? formatDate(passport.dateOfExpiry) : "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>{passport.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Tooltip content="Xem hình ảnh">
                                                <button
                                                    onClick={() => passport.imageUrl && handleViewImage(passport.imageUrl)}
                                                >
                                                    <Image className="text-cyan-500 hover:text-cyan-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip content="Xóa"
                                            >
                                                <button
                                                    // onClick={() => passport.passportNo && onDeletePassportUpload(passport.passportNo)}
                                                >
                                                    <Trash2 className="text-red-500 hover:text-red-700 hover:transition-all hover:duration-300 hover:ease-in-out" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={11} className="text-center uppercase font-semibold">Không có dữ liệu đã lưu</Table.Cell>
                            </Table.Row>
                        )} */}
                    </Table.Body>
                </Table>
                <ImageModal isOpen={isModalOpen} imageUrl={selectedImageUrl || ""} onClose={closeModal} />
            </div>
        </div>
    );
}

export default PassportUpload;