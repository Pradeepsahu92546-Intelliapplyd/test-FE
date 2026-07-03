// models/interfaces/api/profile-api.interface.ts
// Represents the EXACT field names returned by the backend

// _______ Response interfaces _______

// Profile API response shapes
export interface ProfileApiResponse {
  fname: string;
  lname: string;
  uname: string;
  email: string;
  phone: string;
  utype: string;
  accType: string;
  lstLogin: string;
  accCreated: string;
  dob: string;
  pic: string;
  loc: string;
}


// Address-list API response shapes
export interface AddressListItemApi {
  id: string;
  faddress: string; // full one-line address string
}
// Address-detail API response shapes
export interface AddressDetailApi {
  id: string;
  sAddr1: string;
  Saddr2: string;
  city: string;
  state: string;
  country: string;
  code: string;
  type: string;
  locLink: string | null;
}
// Company API response shapes
export interface CompanyApiResponse {
  name: string;
  phone: string;
  companyType: string;
  website: string;
  gstNo: string;
}


// _______ Request   interfaces _______

// updateProfileBasic request body
export interface UpdateProfileBasicRequest {
  firstName: string;
  lastName: string;
  dob: string; // ISO date string (yyyy-mm-dd)
}


// AddAddress & updateAddress request body
export interface UpdateAddressRequest {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: string;
}

// updateCompanyDetails request body
export interface UpdateCompanyDetailsRequest {
  name: string;
  phoneNumber: string;
  Type: string;
  website: string;
  gstNumber: string;
}