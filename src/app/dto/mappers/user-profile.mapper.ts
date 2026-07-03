// mappers/profile.mapper.ts
// THIS IS THE SINGLE MAPPING PLACE.
// When the BE renames a field, you only edit here — no component changes needed.

import { ProfileModel, AddressModel, CompanyModel } from '../models/user-profile.model';
import {
  ProfileApiResponse,
  AddressListItemApi,
  AddressDetailApi,
  CompanyApiResponse,
  UpdateProfileBasicRequest,
  UpdateAddressRequest,
  UpdateCompanyDetailsRequest,
} from '../interfaces/profile-api.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiErrorCode } from '../interfaces/api-result.interface';
import { from } from 'rxjs';


// SINGLE MAPPING PLACE — only this file changes when BE renames fields.

//  Profile
export class ProfileMapper {

  /** BE response (interface) → ProfileModel (UI) — response fields unchanged */
  static fromApi(data: ProfileApiResponse): ProfileModel {
    return {
      firstName:      data.fname      ?? '',
      lastName:       data.lname      ?? '',
      username:       data.uname      ?? '',
      email:          data.email      ?? '',
      phone:          data.phone      ?? '',
      userType:       data.utype      ?? '',
      accountType:    data.accType    ?? '',
      lastLogin:      ProfileMapper.toDate(data.lstLogin),
      accountCreated: ProfileMapper.toDate(data.accCreated),
      dob:            ProfileMapper.toDate(data.dob),
      profileImage:   data.pic        ?? '',
      location:       data.loc        ?? '',
    };
  }

  /** ProfileModel → updateProfileBasic request body
   *  CHANGED: BE now expects firstName/lastName (not fname/lname)
   */
  static toBasicUpdatePayload(
    p: Pick<ProfileModel, 'firstName' | 'lastName' | 'dob'>,
  ): UpdateProfileBasicRequest {
    const dobDate = p.dob instanceof Date ? p.dob : this.toDate(p.dob);
    console.log('toBasicUpdatePayload',  p );
    return {
      firstName: p.firstName,                                     // ← was fname
      lastName:  p.lastName,                                      // ← was lname
      dob:       dobDate ? dobDate.toISOString().split('T')[0] : '',
    };
  }

  private static toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}



//  Address
export class AddressMapper {

  /** getAddress list item → partial AddressModel */
  static fromListApi(data: AddressListItemApi): Pick<AddressModel, 'id' | 'fullAddress'> {
    return {
      id:          data.id,
      fullAddress: data.faddress ?? '',   // response: faddress (unchanged)
    };
  }

  /** getAddressById / updateAddress response → full AddressModel */
  static fromDetailApi(id: string, fullAddress: string, data: AddressDetailApi): AddressModel {
    return {
      id,
      fullAddress,
      streetAddress1: data.sAddr1  ?? '',   // response: sAddr1  (unchanged)
      streetAddress2: data.Saddr2  ?? '',   // response: Saddr2  (unchanged)
      city:           data.city    ?? '',
      state:          data.state   ?? '',
      country:        data.country ?? '',
      postalCode:     data.code    ?? '',   // response: code    (unchanged)
      addressType:    AddressMapper.normaliseType(data.type),
      locationLink:   data.locLink ?? null,
    };
  }

  /** AddressModel → add/update request body
   *  CHANGED: BE now expects Type (capital T) instead of type
   */
  static toPayload(
    a: Omit<AddressModel, 'id' | 'fullAddress' | 'locationLink'>,
  ): UpdateAddressRequest {
    return {
      streetAddress1: a.streetAddress1,
      streetAddress2: a.streetAddress2,
      city:           a.city,
      state:          a.state,
      country:        a.country,
      postalCode:     a.postalCode,
      type:           a.addressType,        // ← was type (lowercase)
    };
  }

  static normaliseType(type: string): string {
    if (!type) return 'Office';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  static buildFullAddress(
    a: Pick<AddressModel, 'streetAddress1' | 'streetAddress2' | 'city' | 'state' | 'country' | 'postalCode'>,
  ): string {
    return [a.streetAddress1, a.streetAddress2, a.city, a.state, a.country, a.postalCode]
      .filter(Boolean)
      .join(', ');
  }
}


//  Company
export class CompanyMapper {

  /** BE response → CompanyModel (UI)
   *  CHANGED response fields:
   *    phoneNumber → phone
   *    gstNumber   → gstNo
   */
  static fromApi(data: CompanyApiResponse): CompanyModel {
    return {
      name:        data.name        ?? '',
      phoneNumber: data.phone       ?? '',   // ← response field was phoneNumber, now phone
      companyType: data.companyType ?? '',
      website:     data.website     ?? '',
      gstNumber:   data.gstNo       ?? '',   // ← response field was gstNumber, now gstNo
    };
  }

  /** CompanyModel → updateCompanyDetails request body
   *  CHANGED request fields:
   *    companyType → Type  (capital T)
   *  Unchanged: name, phoneNumber, website, gstNumber
   */
  static toPayload(c: CompanyModel): UpdateCompanyDetailsRequest {
    return {
      name:        c.name,
      phoneNumber: c.phoneNumber,
      Type:        c.companyType,            // ← was companyType; request now expects Type
      website:     c.website,
      gstNumber:   c.gstNumber,
    };
  }
}

// ─────────────────────────────────────────────
//  HTTP Error → ApiError
// ─────────────────────────────────────────────
export function mapHttpError(err: HttpErrorResponse): ApiError {
  const beMessage: string = err.error?.message ?? '';

  const codeMap: Record<number, ApiErrorCode> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'UNAUTHORIZED',
    404: 'NOT_FOUND',
    500: 'SERVER_ERROR',
    502: 'SERVER_ERROR',
    503: 'SERVER_ERROR',
  };

  const uiMessages: Record<number, string> = {
    400: beMessage || 'Invalid request. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    500: 'A server error occurred. Please try again later.',
    502: 'Service temporarily unavailable. Please try again.',
    503: 'Service temporarily unavailable. Please try again.',
  };

  if (err.status === 0) {
    return { code: 'NETWORK_ERROR', message: 'Network error — please check your connection.', status: 0 };
  }

  return {
    code:    codeMap[err.status]    ?? 'UNKNOWN',
    message: (uiMessages[err.status] ?? beMessage) || 'An unexpected error occurred.',
    status:  err.status,
  };
}