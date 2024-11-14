import React from "react";
import { eTourCustomer } from "../../api/interfaces";
import { Spinner, Table, Tooltip } from "flowbite-react";
import { Info } from "lucide-react";

interface EtourListProps {
    dataEtour: eTourCustomer[];
    formatDate: (dateString: string) => string;
    formatSex: (isMale: boolean) => string;
    loadingETour: boolean
}

const ETourList: React.FC<EtourListProps> = ({ dataEtour, formatDate, formatSex, loadingETour }) => {
    //#region Modal open Passport Image
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // const handleViewImage = (imageUrl: string) => {
    //     setSelectedImageUrl(imageUrl);
    //     setIsModalOpen(true);
    // }

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedImageUrl(null);
    // }
    //#endregion

    //#region Loading & Error
    if (loadingETour) {
        return (
            <div className="flex flex-row justify-center gap-3 items-center">
                <span className="pl-3">Đang tải dữ liệu...</span>
                <Spinner aria-label="Spinner button example" size="sm" />
            </div>
        )
    }
    if (!dataEtour.length)
        return (
            <div className="flex justify-center">Hiện tại không có dữ liệu</div>
        );
    //#endregion


    return (
        <div className="space-y-4" id="etour">
            <div className="flex justify-center items-center gap-2">
                <h1 className="font-semibold text-2xl text-center">Danh sách eTour</h1>
                <Tooltip content="Danh sách đã lưu từ hệ thống">
                    <Info className="size-5 text-cyan-500 translate-y-0.5" />
                </Tooltip>
            </div>
            <div className="overflow-x-auto">
                {dataEtour.map((etour, index) => (
                    <Table key={index}>
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
                        <Table.Body className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {etour.fullName ?? 'Chưa có thông tin'}
                                </Table.Cell>
                                <Table.Cell>{etour.sex !== undefined ? formatSex(etour.sex) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.placeOfBirth ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.nationality ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.passportNo ?? 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.dateOfBirth ? formatDate(etour.dateOfBirth) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.dateOfIssue ? formatDate(etour.dateOfIssue) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.idCardNo ?? "Chưa có thông tin"}</Table.Cell>
                                <Table.Cell>{etour.dateOfIssue ? formatDate(etour.dateOfIssue) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>{etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : 'Chưa có thông tin'}</Table.Cell>
                                <Table.Cell>
                                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                        Edit
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                ))}
            </div>
            {/* <div className="flex justify-center flex-col gap-4">
                {dataEtour.map((etour, index) => (
                    <div key={index} className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-lg space-y-1.5">
                        <div className="space-y-2.5">
                            <p className="font-bold text-gray-900">Họ tên: {etour.fullName ?? 'Chưa có thông tin'}</p>
                            <p>Giới tính: {etour.sex !== undefined ? formatSex(etour.sex) : 'Chưa có thông tin'}</p>
                            <p>Nơi sinh: {etour.placeOfBirth ?? 'Chưa có thông tin'}</p>
                            <p>Quốc tịch: {etour.nationality ?? 'Chưa có thông tin'}</p>
                            <p>Ngày sinh: {etour.dateOfBirth ? formatDate(etour.dateOfBirth) : 'Chưa có thông tin'}</p>
                            <hr className="border-gray-300"/>
                            <p className="font-bold text-gray-900">Số Passport: {etour.passportNo ?? 'Chưa có thông tin'}</p>
                            <p>Ngày cấp: {etour.dateOfIssue ? formatDate(etour.dateOfIssue) : 'Chưa có thông tin'}</p>
                            <p>Ngày hết hạn: {etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : 'Chưa có thông tin'}</p>
                            <hr className="border-gray-300"/>
                            <p className="font-bold text-gray-900">Số CCCD/CMND: {etour.idCardNo ?? "Chưa có thông tin"}</p>
                            <p>Ngày cấp: {etour.dateOfIssue ? formatDate(etour.dateOfIssue) : 'Chưa có thông tin'}</p>
                            <p>Ngày hết hạn: {etour.dateOfExpiry ? formatDate(etour.dateOfExpiry) : 'Chưa có thông tin'}</p>
                        </div>
                        <div className="flex justify-end items-center gap-4">
                            <div>
                                <button
                                    type="button"
                                    className="bg-cyan-500 rounded-xl w-full h-12 px-4 flex items-center justify-center group hover:bg-cyan-600 font-semibold text-sm"
                                    onClick={() => etour.imageUrl && handleViewImage(etour.imageUrl)}
                                >
                                    Xem hình ảnh
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <ImageModal
                    isOpen={isModalOpen}
                    imageUrl={selectedImageUrl || ""}
                    onClose={closeModal}
                />
            </div> */}
        </div>
    )
}

export default ETourList;