// src/app/services/unit-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}
  get baseUrl(): string {
    return environment.apiUrl;
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // Fetch user unit-list
  getUnitsList(): Observable<any> {
    console.log('calling getUnitsList API with baseUrl:', this.baseUrl);
    //  mock
    // const mockUnitsList = {
    //   units: [
    //     {
    //       id: '00f3692b-47a7-4569-9d28-dd45f3a38fa8',
    //       name: 'Plant4',
    //       cretAt: '2026-03-09T07:40:41.267739Z',
    //       isActive: true,
    //       type: 'owned',
    //       descrpt: 'Plant4',
    //       isDefault: false,
    //       createdBy: 'pradeep new mohanty',
    //       currentSubscription: {
    //         planName: 'Free',
    //         status: 'live',
    //         validUntil: '2027-03-09',
    //       },
    //     },
    //     {
    //       id: '95594cc1-c8ec-4142-85ef-a4815280b238',
    //       name: 'pradeep new mohanty',
    //       cretAt: '2026-03-06T14:59:21.494629Z',
    //       isActive: false,
    //       type: 'owned',
    //       descrpt: null,
    //       isDefault: true,
    //       createdBy: 'pradeep new mohanty',
    //       currentSubscription: {
    //         planName: 'Free',
    //         status: 'live',
    //         validUntil: '2027-03-06',
    //       },
    //     },
    //   ],
    // };

    // Simulate a successful response (200 OK)
    // return of({
    //   code: 200,
    //   message: 'Units list fetched successfully',
    //   data: mockUnitsList,
    //   meta: {
    //     count: 2,
    //     next: null,
    //     previous: null,
    //   },
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10)); // simulate network delay

    // real API integration
    const url = `${this.baseUrl}/v1/units/`;
    return this.http.get(url, this.httpOptions);
  }

  // Post for Create new unit
  createUnit(data: {
    name: string;
    description: string;
  }): Observable<any> {
    // Mock response
    // const mockResponse = {
    //   code: 201,
    //   message: 'Unit created successfully',
    //   data: {
    //      id: "b8fb0ff1-f1fb-4e68-9938-046d73f16f5c",
    //      name: "Vijays-planter",
    //      cretAt: "2026-03-17T09:23:21.080194Z",
    //      isActive: true,
    //      type: "owned",
    //      descrpt: "Vijays-plant",
    //      isDefault: false,
    //      createdBy: "pradeep new mohanty",
    //      currentSubscription: {
    //          planName: "Free",
    //          status: "live",
    //          validUntil: "2027-03-17"
    //      }
    //   },
    //   meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // };

    // // Simulate a successful response (201 Created)
    // return of(mockResponse).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/`;
    return this.http.post(url, data, this.httpOptions);
  }

  // Fetch unit details
  getUnitDetails(unitId: string): Observable<any> {
    // Mock response
    // const mockResponse = {
    //   unit: {
    //     id: '00f3692b-47a7-4569-9d28-dd45f3a38fa8',
    //     name: 'Plant4',
    //     cretAt: '2026-03-09T07:40:41.267739Z',
    //     isActive: true,
    //     type: 'owned',
    //     descrpt: 'Plant4',
    //     isDefault: false,
    //     createdBy: 'pradeep new mohanty',
    //     currentSubscription: {
    //       planName: 'Free',
    //       status: 'live',
    //       validUntil: '2027-03-09',
    //     },
    //   },
    //   teams: [],
    //   members: [
    //     {
    //       id: 'b3f35902-9899-42de-bbdb-411849bc2408',
    //       email: 'pradeepsahu92546@gmail.com',
    //       name: 'pradeep new mohanty',
    //       type: 'owner',
    //       dateJoined: '2026-03-09T07:40:41.390222Z',
    //       status: '',
    //     },
    //   ],
    // };

    // Simulate a successful response (200 OK)
    // return of({
    //   code: 200,
    //   message: 'Unit details fetched successfully',
    //   data: mockResponse,
    //   meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/${unitId}/`;
    return this.http.get(url, this.httpOptions);
  }

  // Update unit details for edit  description
  updateUnit(
    unitId: string,
    data: {
      description?: string;
      isDefault?: boolean;
    },
  ): Observable<any> {
    console.log('update unit', unitId);
    // Mock response
    // const mockResponse = {
    //   code: 200,
    //   message: 'Unit updated successfully',
    //   data: {
    //      id: "b8fb0ff1-f1fb-4e68-9938-046d73f16f5c",
    //      name: "Vijays-planter",
    //      cretAt: "2026-03-17T09:23:21.080194Z",
    //      isActive: true,
    //      type: "owned",
    //      descrpt: "Vijays-plant",
    //      isDefault: false,
    //      createdBy: "pradeep new mohanty",
    //      currentSubscription: {
    //          planName: "Free",
    //          status: "live",
    //          validUntil: "2027-03-17"
    //      }
    //   },
    //   meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // };
    // return of(mockResponse).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/${unitId}/`;
    // patch request as we are updating only few fields
    return this.http.patch(url, data, this.httpOptions);
  }

  // deletea unit
  deleteUnit(unitId: string): Observable<any> {
    console.log('Requesting to delete unit:', unitId);
    // Mock response
    // const mockResponse = {
    //   code: 204,
    //   message: 'Unit deleted successfully',
    //   data: null,
    //   meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // };
    // return of(mockResponse).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/${unitId}/`;
    return this.http.delete(url, this.httpOptions);
  }

  // unit mark as active
  markUnitActive(unitId: string): Observable<any> {
    console.log('Request to Marking unit as active:', unitId);
    // Mock response
    // const mockResponse = {
    //   code: 200,
    //   message: 'Unit marked as active successfully',
    //   data: {},
    //  meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // };

    // return of(mockResponse).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/${unitId}/mark-as-active/`;
    return this.http.post(url, {}, this.httpOptions);
  }

  // unit mark as inactive
  markUnitInactive(unitId: string): Observable<any> {
    console.log('Request to mark unit as inactive:', unitId);
    // // Mock response
    // const mockResponse = {
    //   code: 200,
    //   message: 'Unit marked as inactive successfully',
    //   data: {},
    //   meta: {},
    //   requestId: 'redomid-12345',
    //   timestamp: new Date().toISOString(),
    // };
    // return of(mockResponse).pipe(delay(10)); // simulate network delay

    // real api integration
    const url = `${this.baseUrl}/v1/units/${unitId}/mark-as-inactive/`;
    return this.http.post(url, {}, this.httpOptions);
  }
}
