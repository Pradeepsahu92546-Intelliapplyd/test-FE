// src/app/services/user-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Auth } from './auth/auth';

import {
  ProfileModel,
  AddressModel,
  CompanyModel,
} from '../dto/models/user-profile.model';
import {
  ProfileMapper,
  AddressMapper,
  CompanyMapper,
  mapHttpError,
} from '../dto/mappers/user-profile.mapper';
import { ApiResult } from '../dto/interfaces/api-result.interface';

import {
  ProfileApiResponse,
  AddressDetailApi,
  CompanyApiResponse,
} from '../dto/interfaces/profile-api.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: Auth,
  ) {}
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  get baseUrl(): string {
    return environment.apiUrl;
  }

  // ----- user settingsApi calls -----

  getProfile(): Observable<ApiResult<ProfileModel>> {
    // Mock — fields match ProfileApiResponse exactly
    // const mock: ProfileApiResponse = {
    //   fname: 'John',
    //   lname: 'Doe',
    //   uname: 'jdoe_99',
    //   email: 'j.doe@example.com',
    //   phone: '1234567890',
    //   utype: 'admin',
    //   accType: 'standard',
    //   lstLogin: '2026-03-09T19:50:06Z',
    //   accCreated: '2026-01-15T10:30:00Z',
    //   dob: '1990-01-01',
    //   pic: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
    //   loc: 'New York, USA',
    // };
    // return of({ code: 200, data: mock }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(ProfileMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );

    // Real:
    return this.http
      .get<any>(`${this.baseUrl}/v1/users/profile/`, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(ProfileMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  updateProfileBasic(
    profile: Pick<ProfileModel, 'firstName' | 'lastName' | 'dob'>,
  ): Observable<ApiResult<ProfileModel>> {
    const payload = ProfileMapper.toBasicUpdatePayload(profile);
    console.log('updateProfileBasic payload:', payload);
    // Mock: BE echoes back a ProfileApiResponse — rebuild one using response field names
    // const mockResponse: ProfileApiResponse = {
    //   fname: payload.firstName,
    //   lname: payload.lastName, // request fields → response fields
    //   uname: '',
    //   email: '',
    //   phone: '',
    //   utype: '',
    //   accType: '',
    //   lstLogin: '',
    //   accCreated: '',
    //   dob: payload.dob,
    //   pic: '',
    //   loc: '',
    // };
    // return of({ code: 200, data: mockResponse }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(ProfileMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .put<any>(`${this.baseUrl}/v1/users/profile/`, payload, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(ProfileMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  updateProfilePhone(data: {
    phone: string;
    countryCode: string;
  }): Observable<ApiResult<void>> {
    console.log('updateProfilePhone data:', data);

    // return of({ code: 200 }).pipe(
    //   delay(10),
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .put<any>(
        `${this.baseUrl}/v1/users/profile/phone/`,
        data,
        this.httpOptions,
      )
      .pipe(
        map(() => ApiResult.ok(undefined as void)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  uploadProfileImage(formData: FormData): Observable<ApiResult<void>> {
    console.log('uploadProfileImage formData:', formData.get('file'));
    // return of({ code: 200 }).pipe(
    //   delay(10),
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .post<any>(`${this.baseUrl}/v1/users/update-pic/`, formData)
      .pipe(
        map(() => ApiResult.ok(undefined as void)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Address
  getAddress(): Observable<
    ApiResult<Pick<AddressModel, 'id' | 'fullAddress'>[]>
  > {
    // const mock = {
    //   code: 200,
    //   data: {
    //     addresses: [
    //       {
    //         id: 'aa10843d-4032-4c49-87d3-9e6e60bb6181',
    //         faddress: 'Nasscom CosE, HSR Layout, Bangalore, 560016, India',
    //       },
    //     ],
    //   },
    // };
    // return of(mock).pipe(
    //   delay(10),
    //   map((res) =>
    //     ApiResult.ok(res.data.addresses.map(AddressMapper.fromListApi)),
    //   ),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .get<any>(`${this.baseUrl}/v1/users/address/`, this.httpOptions)
      .pipe(
        map((res) =>
          ApiResult.ok(res.data.addresses.map(AddressMapper.fromListApi)),
        ),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  getAddressById(
    id: string,
    fullAddress = '',
  ): Observable<ApiResult<AddressModel>> {
    // Mock — fields match AddressDetailApi exactly
    // const mock: AddressDetailApi = {
    //   id,
    //   sAddr1: 'Nasscom CosE #29/A, 27th Main, 7th Cross Rd',
    //   Saddr2: 'HSR Layout',
    //   city: 'Bangalore',
    //   state: 'Karnataka',
    //   country: 'India',
    //   code: '560016', // ← AddressDetailApi uses code (not postalCode)
    //   type: 'home', // ← AddressDetailApi uses type lowercase (not Type)
    //   locLink: null,
    // };
    // return of({ code: 200, data: mock }).pipe(
    //   delay(10),
    //   map((res) =>
    //     ApiResult.ok(AddressMapper.fromDetailApi(id, fullAddress, res.data)),
    //   ),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );

    // Real:
    return this.http
      .get<any>(
        `${this.baseUrl}/v1/users/address-detail/${id}/`,
        this.httpOptions,
      )
      .pipe(
        map((res) =>
          ApiResult.ok(AddressMapper.fromDetailApi(id, fullAddress, res.data)),
        ),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  updateAddress(address: AddressModel): Observable<ApiResult<AddressModel>> {
    const payload = AddressMapper.toPayload(address);
    console.log('updateAddress payload:', payload);
    // Mock: BE echoes back an AddressDetailApi — use response field names (sAddr1, Saddr2, code, type)
    // NOT the request field names (streetAddress1, Type etc.)
    // const mockResponse: AddressDetailApi = {
    //   id: address.id,
    //   sAddr1: payload.streetAddress1,
    //   Saddr2: payload.streetAddress2,
    //   city: payload.city,
    //   state: payload.state,
    //   country: payload.country,
    //   code: payload.postalCode,
    //   type: payload.Type.toLowerCase(),
    //   locLink: null,
    // };
    // return of({ code: 200, data: mockResponse }).pipe(
    //   delay(10),
    //   map((res) =>
    //     ApiResult.ok(
    //       AddressMapper.fromDetailApi(
    //         address.id,
    //         address.fullAddress,
    //         res.data,
    //       ),
    //     ),
    //   ),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );

    // Real:
    return this.http
      .put<any>(
        `${this.baseUrl}/v1/users/address-detail/${address.id}/`,
        payload,
        this.httpOptions,
      )
      .pipe(
        map((res) =>
          ApiResult.ok(
            AddressMapper.fromDetailApi(
              address.id,
              address.fullAddress,
              res.data,
            ),
          ),
        ),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  addAddress(
    address: Omit<AddressModel, 'id' | 'fullAddress' | 'locationLink'>,
  ): Observable<ApiResult<AddressModel>> {
    const payload = AddressMapper.toPayload(address);
    console.log('addAddress payload:', payload);
    // return of({ code: 200 }).pipe(
    //   delay(10),
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .post<any>(`${this.baseUrl}/v1/users/address/`, payload, this.httpOptions)
      .pipe(
        map((res) => {
          // Assuming the API returns the created address with ID
          const createdAddress = AddressMapper.fromDetailApi(
            res.data.id,
            AddressMapper.buildFullAddress(address),
            res.data,
          );
          return ApiResult.ok(createdAddress);
        }),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  deleteAddress(id: string): Observable<ApiResult<void>> {
    // return of({ code: 200 }).pipe(
    //   delay(10),
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .delete<any>(
        `${this.baseUrl}/v1/users/address-detail/${id}/`,
        this.httpOptions,
      )
      .pipe(
        map(() => ApiResult.ok(undefined as void)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Company
  getCompanyDetails(): Observable<ApiResult<CompanyModel>> {
    // Mock — fields match CompanyApiResponse exactly
    // const mock: CompanyApiResponse = {
    //   name: 'Intel2',
    //   phone: '3434342342', // ← CompanyApiResponse uses phone (not phoneNumber)
    //   companyType: 'trr',
    //   website: 'https://www.google.com',
    //   gstNo: 'fd3423sfs', // ← CompanyApiResponse uses gstNo (not gstNumber)
    // };
    // return of({ code: 200, data: mock }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(CompanyMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .get<any>(`${this.baseUrl}/v1/users/company/`, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(CompanyMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  updateCompanyDetails(
    company: CompanyModel,
  ): Observable<ApiResult<CompanyModel>> {
    const payload = CompanyMapper.toPayload(company);
    console.log('updateAddress payload:', payload);
    // Mock: BE echoes back a CompanyApiResponse — use response field names (phone, gstNo)
    // NOT the request field names (phoneNumber, gstNumber, Type)
    // const mockResponse: CompanyApiResponse = {
    //   name: payload.name,
    //   phone: payload.phoneNumber, // request phoneNumber → response phone
    //   companyType: payload.Type, // request Type → response companyType
    //   website: payload.website,
    //   gstNo: payload.gstNumber, // request gstNumber → response gstNo
    // };
    // return of({ code: 200, data: mockResponse }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(CompanyMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .put<any>(`${this.baseUrl}/v1/users/company/`, payload, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(CompanyMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  // ---- account settings api calls ----

  //  account deactivation
  deactivateAccount(): Observable<any> {
    // mock response
    // return of({
    //   code: 200,
    //   message: 'Account deactivated successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.post(`${this.baseUrl}/v1/accounts/deactivate/`, {});
  }

  // delete user account
  deleteAccount(): Observable<any> {
    // mock response
    // return of({
    //   code: 200,
    //   message: 'Account deleted successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.post(`${this.baseUrl}/v1/accounts/delete/`, {});
  }

  // list of additonal emails
  getAdditionalEmails(): Observable<any> {
    // mock response
    // const mockResponse = {
    //   emails: [
    //     {
    //       id: '01dc5748-d1b4-4224-88ac-62bad0f83222',
    //       email: 'vijaycriss123@gmail.com',
    //       isDefault: false,
    //       isPrimary: false,
    //     },
    //     {
    //       id: '3e65ab47-e873-46f4-b54e-ab8eedd79721',
    //       email: 'vijaycrss32@gmail.com',
    //       isDefault: false,
    //       isPrimary: false,
    //     },
    //   ],
    // };
    // return of({
    //   code: 200,
    //   data: mockResponse,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.get(`${this.baseUrl}/v1/accounts/additional-emails/`, {});
  }

  // add new email
  addAdditionalEmail(
    email: string,
    isPrimary: boolean,
    isDefault: boolean,
  ): Observable<any> {
    // mock response

    // return of({
    //   code: 200,
    //   message: 'Email added successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.post(`${this.baseUrl}/v1/accounts/additional-emails/`, {
      email: email,
      isPrimary: isPrimary,
      isDefault: isDefault,
    });
  }

  // ---- security settings api calls ----

  // update password
  updatePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Observable<any> {
    console.log('updatePassword data:', data);

    // mock response
    // return of({
    //   code: 200,
    //   message: 'Password updated successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.put(`${this.baseUrl}/v1/users/change-password/`, data);
  }

  // reset password  (when user login inside the app)
  forgetPasswordWithToken(data: {
    newPassword: string;
    confirmNewPassword: string;
  }) {
    // mock response
    console.log('forgetPasswordWithToken data:', data);
    const token = this.authService.getToken(); // get token from auth service
    // return of({
    //   code: 200,
    //   message: 'Password updated successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay
    return this.http.post(
      `${this.baseUrl}/v1/uses/reset-Password/${token}/`,
      data,
    );
  }

  getAllLoginDevices(): Observable<any> {
    // mock response
    // const mockResponse = {
    //   devices: [
    //     {
    //       id: 101,
    //       deviceName: 'Chrome on Windows 11',
    //       ipAddress: '122.161.54.210',
    //       location: 'Bengaluru, India',
    //       lastActive: '2023-10-27T10:30:00Z',
    //       isCurrentDevice: true,
    //       sessionId: 'ref_token_jti_1',
    //     },
    //     {
    //       id: 102,
    //       deviceName: 'iPhone 15 - Safari',
    //       ipAddress: '106.201.12.45',
    //       location: 'Mumbai, India',
    //       lastActive: '2023-10-26T22:15:00Z',
    //       isCurrentDevice: false,
    //       sessionId: 'ref_token_jti_2',
    //     },
    //   ],
    // };
    // return of({
    //   code: 200,
    //   data: mockResponse,
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.get(`${this.baseUrl}/v1/accounts/security/devices/`, {});
  }

  // logout all devices except current one
  logoutAllDevices(): Observable<any> {
    // mock

    // return of({
    //   code: 200,
    //   message: 'Email added successfully',
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10)); // simulate network delay

    // real api
    return this.http.post(
      `${this.baseUrl}/v1/accounts/security/logout-all/`,
      {},
    );
  }

  // --- preference settings api calls ----

  // fetch user preference
  getUserPreference(): Observable<any> {
    // get user preference
    // return of({
    //   code: 200,
    //   data: {
    //     id: '61b98bb8-6398-4d39-88c7-c4fe8cd305ed',
    //     createdAt: '2026-03-06T06:27:55.961142Z',
    //     updatedAt: '2026-03-06T06:32:50.712145Z',
    //     deletedAt: null,
    //     isActive: true,
    //     preferences: {
    //       userSettings: {
    //         localization: {
    //           theme: 'light',
    //           currency: 'INR',
    //           language: 'en-IN',
    //           timezone: 'Asia/Kolkata',
    //         },
    //         notifications: {
    //           pushEnabled: true,
    //           emailPreference: {
    //             reports: true,
    //             promotion: false,
    //             securityAlerts: true,
    //           },
    //         },
    //       },
    //       accountSettings: {
    //         governance: {
    //           mfaEnforced: true,
    //           sessionTimeoutMinutes: 60,
    //         },
    //         unitBoundaries: {
    //           crossUnitCollaboration: 'view_only',
    //         },
    //       },
    //     },
    //     createdBy: null,
    //     deletedBy: null,
    //     userId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
    //   },
    //   meta: {
    //     requestId: 'redomid-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // }).pipe(delay(10));

    return this.http
      .get<any>(`${this.baseUrl}/v1/users/user-setting/`, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(res.data)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  // update preference
  updateUserPreference(data: any): Observable<any> {
    console.log('updateUserPreference data:', data);
    // update userpreference
    //  return of({
    //       code: 200,
    //       message: 'Preference updated successfully',
    //       meta: {
    //         requestId: 'redomid-12345',
    //         timestamp: new Date().toISOString(),
    //       },
    //     }).pipe(delay(10)); // simulate network delay

    // current the BE is not ready donot remove the mocks
    return this.http
      .patch<any>(
        `${this.baseUrl}/v1/users/user-setting/`,
        data,
        this.httpOptions,
      )
      .pipe(
        map(() => ApiResult.ok(undefined as void)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }
}
