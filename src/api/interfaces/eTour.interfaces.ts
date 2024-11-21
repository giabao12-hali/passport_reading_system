import { ApiPassportResponse } from "./passport.interfaces";

export interface ApiEtourResponse {
  status: number;
  message: string;
  code: number;
  response: ETourBooking[];
}

export interface ETourBooking {
  // tourCode: string;
  // bookingID: string;
  // bookingNo: string;
  // tourNote: string;
  // adultNumber: number;
  // childNumber: number;
  // infantNumber: number;
  // totalGuest: number;
  bookingId: string | null;
  memberInfors?: eTourCustomer[];
}

export interface IDentificationInfo {
  dateOfBirth: string;
  issueDate: string;
  expireDate: string;
  documentNumber: string;
}

export interface ApiTotalResponse{
  totalGuest: number;
  etour: eTourCustomer[];
  extract: ApiPassportResponse[];
}

export interface eTourCustomer{
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
