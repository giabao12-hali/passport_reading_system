export interface ApiPassportResponse {
    id?: number
  bookingId?: string
  fullName?: string
  nationality?: string
  dateOfBirth?: string
  sex?: boolean;
  dateOfIssue?: string
  placeOfIssue?: string
  passportNo?: string
  placeOfBirth?: string
  idCardNo?: string
  dateOfExpiry?: string
  imageUrl?: string,
  isSimilar: boolean,
  address?: string,
  isOpen: boolean,
}