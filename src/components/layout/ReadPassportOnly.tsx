import React, { useEffect, useState } from "react";
import { ApiPassportResponse } from "../../api/interfaces";
import { Card, Spinner, Tooltip } from "flowbite-react";
import InputWithIcon from "../icons/InputWithIcon";
import { Earth, Edit, IdCard, MapPin, RotateCw, Save, TicketsPlane, Trash2, User, X } from "lucide-react";

interface ReadPassportOnlyProps {
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loading: boolean;
    loadingPassportUpload: boolean;
    dataExtract: ApiPassportResponse[];
    dataUpload: ApiPassportResponse[];
    onDeletePassport: (id: number) => Promise<void>;
    onSaveEdit: (id: number, data: ApiPassportResponse[]) => Promise<void>;
}

const ReadPassportOnly: React.FC<ReadPassportOnlyProps> = ({ formatDate, formatSex, dataUpload, dataExtract, loading, onDeletePassport, loadingPassportUpload, onSaveEdit }) => {
    //#region Editing Fields
    const [editedData, setEditedData] = useState<ApiPassportResponse[]>([]);
    const [editRows, setEditRows] = useState<Set<number>>(new Set());

    // useEffect(() => {
    //     setEditedData(dataUpload);
    // }, [dataUpload]);

    useEffect(() => {
        setEditedData(dataExtract);
    }, [dataExtract]);

    // Enable editing for all rows
    const enableEdit = (index: number) => {
        const newEditRows = new Set(editRows);
        newEditRows.add(index);
        setEditRows(newEditRows);
    };

    // Save edited data and exit edit mode
    const saveEdit = async (index: number) => {
        const passportToUpdate = editedData[index];
        try {
            await onSaveEdit(passportToUpdate.id!, [passportToUpdate]);

            const newEditRows = new Set(editRows);
            newEditRows.delete(index);
            setEditRows(newEditRows);

            // Cập nhật lại dataExtract với dữ liệu chỉnh sửa
            const updatedDataExtract = [...dataExtract];
            updatedDataExtract[index] = passportToUpdate;
            setEditedData(updatedDataExtract);
        } catch (error) {
            console.error(error);
        }
    }

    // Reset edited data to original
    const resetEdit = (index: number) => {
        const newEditedData = [...editedData];
        newEditedData[index] = { ...dataExtract[index] };
        setEditedData(newEditedData);
    };

    // Cancel editing mode without saving
    const cancelEdit = (index: number) => {
        const newEditRows = new Set(editRows);
        newEditRows.delete(index);  // Xóa hàng khỏi chế độ chỉnh sửa
        setEditRows(newEditRows);

        // Khôi phục dữ liệu gốc từ `dataUpload` vào `editedData`
        const newEditedData = [...editedData];
        newEditedData[index] = { ...dataExtract[index] };
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

    if (loading) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="sm" />
            </div>
        )
    }
    if (loadingPassportUpload) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="sm" />
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mb-4">
                <h1 className="font-bold text-xl text-black text-center">Thông tin passport</h1>
            </div>
            {loadingPassportUpload ?
                <div className="flex flex-row justify-center gap-3 items-center">
                    <span className="pl-3">Đang tải dữ liệu...</span>
                    <Spinner aria-label="Spinner button example" size="sm" />
                </div>
                :
                <div className="space-y-8 flex justify-center">
                    <div className="w-1/2 space-y-8 mobile:w-full">
                        {editedData.map((passport, index) => (
                            <React.Fragment key={index}>
                                <Card className="bg-yellow-100">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-2xl font-bold">
                                            Khách {index + 1}
                                        </h5>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mobile:flex mobile:flex-col tablet:flex tablet:flex-col">
                                        <div className="space-y-4">
                                            <div id="fullName" className="font-bold">
                                                <p>
                                                    Họ tên:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="sex">
                                                <p>
                                                    Giới tính:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="address">
                                                <p>
                                                    Địa chỉ:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="nationality">
                                                <p>
                                                    Quốc tịch:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="passportNo" className="font-bold">
                                                <p>
                                                    Số Passport:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="dateOfBirth">
                                                <p>
                                                    Ngày sinh:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="dateOfIssue">
                                                <p>
                                                    Ngày cấp:&nbsp;
                                                </p>
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
                                            </div>
                                            <div id="dateOfExpiry">
                                                <p>
                                                    Ngày hết hạn:&nbsp;
                                                </p>
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
                                            </div>
                                            <p className="font-bold">
                                                Số CCCD/CMND:&nbsp;
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
                                            </p>
                                            <div className="border border-solid border-gray-900 opacity-10"></div>
                                            <div className="flex items-center gap-2">
                                                {editRows.has(index) ? (
                                                    <>
                                                        <Tooltip content="Lưu">
                                                            <button type="button" onClick={() => saveEdit(index)} className="px-4 py-2 bg-green-500 hover:bg-green-600 hover:transition-all hover:duration-300 hover:ease-in-out rounded-lg">
                                                                <Save className="text-white" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip content="Hủy">
                                                            <button type="button" onClick={() => cancelEdit(index)} className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:transition-all hover:duration-300 hover:ease-in-out rounded-lg">
                                                                <X className="text-white" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip content="Reset">
                                                            <button type="button" onClick={() => resetEdit(index)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 hover:transition-all hover:duration-300 hover:ease-in-out rounded-lg">
                                                                <RotateCw className="text-white" />
                                                            </button>
                                                        </Tooltip>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip content="Chỉnh sửa">
                                                            <button
                                                                type="button"
                                                                onClick={() => enableEdit(index)}
                                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:transition-all hover:duration-300 hover:ease-in-out rounded-lg">
                                                                <Edit className="text-white" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip content="Xóa">
                                                            <button
                                                                onClick={() => passport.id !== undefined && onDeletePassport(passport.id)}
                                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:transition-all hover:duration-300 hover:ease-in-out rounded-lg"
                                                            >
                                                                <Trash2 className="text-white" />
                                                            </button>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <img src={passport.imageUrl} alt={passport.fullName} className="rounded-md" />
                                        </div>
                                    </div>

                                </Card>
                            </React.Fragment>
                        ))}
                        <React.Fragment>
                            {dataUpload.map((passport, index) => (
                                <React.Fragment key={index}>
                                    <Card className="bg-yellow-100">
                                        <h5 className="text-2xl font-bold">
                                            Khách {index + 1}
                                        </h5>
                                        <div className="grid grid-cols-3 gap-4 mobile:flex mobile:flex-col tablet:flex tablet:flex-col">
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
                                            </div>
                                            <div className="col-span-2">
                                                <img src={passport.imageUrl} alt={passport.fullName} className="rounded-md" />
                                            </div>
                                        </div>
                                    </Card>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    </div>
                </div>
            }
        </div>
    );
}

export default ReadPassportOnly;