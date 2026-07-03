// models/user-profile.model.ts
// These are the clean camelCase shapes as components work with.
// Noted : Never import api interfaces directly in components — use these models.

export interface ProfileModel {
  firstName:      string;
  lastName:       string;
  username:       string;
  email:          string;
  phone:          string;
  userType:       string;
  accountType:    string;
  lastLogin:      Date | null;
  accountCreated: Date | null;
  dob:            Date | null;
  profileImage:   string;
  location:       string;
}

export interface AddressModel {
  id:             string;
  fullAddress:    string;    // from list endpoint (faddress)
  streetAddress1: string;    // from detail endpoint (sAddr1)
  streetAddress2: string;    // from detail endpoint (Saddr2)
  city:           string;
  state:          string;
  country:        string;
  postalCode:     string;    // from detail endpoint (code)
  addressType:    string;    // normalised to 'Home' | 'Office'
  locationLink:   string | null;
}

export interface CompanyModel {
  name:        string;
  phoneNumber: string;
  companyType: string;
  website:     string;
  gstNumber:   string;
}