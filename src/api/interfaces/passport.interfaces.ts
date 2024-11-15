export interface ApiPassportResponse {
    id?: number;
    bookingId?: string;
    fullName?: string;
    nationality?: string;
    address?: string;
    sex?: boolean;
    dateOfIssue?: string;
    placeOfIssue?: string;
    passportNo?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    idCardNo?: string;
    dateOfExpiry?: string;
    imageUrl?: string;
    isSimilar: boolean,
}