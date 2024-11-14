import { ApiPassportResponse } from "../interfaces";

export const mockPassportData: ApiPassportResponse[] = [
    {
        fullName: "Nguyễn Văn A",
        nationality: "Việt Nam",
        dateOfBirth: "01/01/1990",
        sex: true,
        dateOfIssue: "01/01/2020",
        placeOfIssue: "Hà Nội",
        passportNo: "123456789",
        placeOfBirth: "Hà Nội",
        idCardNo: "123456789",
        dateOfExpiry: "01/01/2025",
        imageUrl: "https://via.placeholder.com/150",
        bookingId: "BOOKING001",
        isSimilar: false
    },
    {
        fullName: "Nguyễn Văn B",
        nationality: "Việt Nam",
        dateOfBirth: "02/02/1992",
        sex: false,
        dateOfIssue: "02/02/2020",
        placeOfIssue: "Hồ Chí Minh",
        passportNo: "987654321",
        placeOfBirth: "Hồ Chí Minh",
        idCardNo: "987654321",
        dateOfExpiry: "02/02/2025",
        imageUrl: "https://via.placeholder.com/150",
        bookingId: "BOOKING002",
        isSimilar: true
    },
    {
        fullName: "Nguyễn Văn C",
        nationality: "Việt Nam",
        dateOfBirth: "03/03/1993",
        sex: true,
        dateOfIssue: "03/03/2020",
        placeOfIssue: "Đà Nẵng",
        passportNo: "567890123",
        placeOfBirth: "Đà Nẵng",
        idCardNo: "567890123",
        dateOfExpiry: "03/03/2025",
        imageUrl: "https://via.placeholder.com/150",
        bookingId: "BOOKING003",
        isSimilar: false
    }
];
