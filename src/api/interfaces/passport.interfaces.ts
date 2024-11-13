import { ETourBooking } from "./eTour.interfaces";

export interface ApiPassportResponse {
    id?: number;
    bookingId?: ETourBooking["bookingId"];
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