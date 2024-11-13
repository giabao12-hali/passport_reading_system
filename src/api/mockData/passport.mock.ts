import { ApiPassportResponse } from "../interfaces";

export const mockPassportData: ApiPassportResponse[] = [
    {
        type: "passport",
        fullName: "Nguyễn Văn A",
        nationality: "Việt Nam",
        dateOfBirth: "01/01/1990",
        sex: "Nam",
        dateOfIssue: "01/01/2020",
        placeOfIssue: "Hà Nội",
        passportNo: "123456789",
        placeOfBirth: "Hà Nội",
        idCardNo: "123456789",
        dateOfExpiry: "01/01/2025",
        issuingAuthority: "Cục Xuất Nhập Cảnh Hà Nội",
        imageUrl: "https://via.placeholder.com/150",
        logTime: "2020-01-01T08:00:00Z",
        bookingId: "BOOKING001"
    },
    {
        type: "passport",
        fullName: "Nguyễn Văn B",
        nationality: "Việt Nam",
        dateOfBirth: "02/02/1992",
        sex: "Nữ",
        dateOfIssue: "02/02/2020",
        placeOfIssue: "Hồ Chí Minh",
        passportNo: "987654321",
        placeOfBirth: "Hồ Chí Minh",
        idCardNo: "987654321",
        dateOfExpiry: "02/02/2025",
        issuingAuthority: "Cục Xuất Nhập Cảnh Hồ Chí Minh",
        imageUrl: "https://via.placeholder.com/150",
        logTime: "2020-02-02T08:00:00Z",
        bookingId: "BOOKING002"
    },
    {
        type: "passport",
        fullName: "Nguyễn Văn C",
        nationality: "Việt Nam",
        dateOfBirth: "03/03/1993",
        sex: "Nam",
        dateOfIssue: "03/03/2020",
        placeOfIssue: "Đà Nẵng",
        passportNo: "567890123",
        placeOfBirth: "Đà Nẵng",
        idCardNo: "567890123",
        dateOfExpiry: "03/03/2025",
        issuingAuthority: "Cục Xuất Nhập Cảnh Đà Nẵng",
        imageUrl: "https://via.placeholder.com/150",
        logTime: "2020-03-03T08:00:00Z",
        bookingId: "BOOKING003"
    }
];
