// services/permissions.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResult } from '../dto/interfaces/api-result.interface';
import {
  RoleDetailsModel,
  RoleListModel,
  RuleDetailsModel,
  RuleListModel,
} from '../dto/models/unit-permissions.model';
import { RoleDetailsApiResponse } from '../dto/interfaces/unit-permissions.interface';
import {
  RoleMapper,
  RuleMapper,
  mapHttpError,
} from '../dto/mappers/unit-permissions.mapper';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private get httpOptions() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    return environment.apiUrl;
  }

  // ________ Role management API's (account specific) ________

  //  Mock data (shared across methods)
  // private get mockRoles(): RoleDetailsApiResponse[] {
  //   return [
  //     {
  //       id: '2426a96e-185a-4068-97d0-c98727b4231e',
  //       name: 'Analyst',
  //       isCustom: false,
  //       type: 'PLATFORM',
  //       composition: [],
  //       cretAt: '2026-03-04T11:03:13.889010Z',
  //       descrpt: 'Analyst will full system analysis',
  //     },
  //     {
  //       id: '9fc89c33-e153-4013-9c20-a4f742fffc54',
  //       name: 'Owner',
  //       isCustom: false,
  //       type: 'PLATFORM',
  //       composition: [],
  //       cretAt: '2026-03-04T05:34:49.097409Z',
  //       descrpt: 'Unit Owner with full administrative privileges',
  //     },
  //     {
  //       id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa',
  //       name: 'Viewer',
  //       isCustom: false,
  //       type: 'PLATFORM',
  //       composition: [],
  //       cretAt: '2026-03-04T11:04:50.991852Z',
  //       descrpt: 'Viewer to view all',
  //     },
  //     {
  //       id: 'ae3c6a0b-b35d-450f-b726-5742da4c88f1',
  //       name: 'Copy of Unit Owner',
  //       isCustom: true,
  //       type: 'USER',
  //       composition: [
  //         { id: '2426a96e-185a-4068-97d0-c98727b4231e', name: 'Analyst' },
  //         { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
  //       ],
  //       cretAt: '2026-03-04T14:03:18.601919Z',
  //       descrpt: 'Can access all systems',
  //     },
  //     {
  //       id: '16d33505-2e9c-44d2-b3e6-b989bc99960c',
  //       name: 'Copy of Unit Owner (2)',
  //       isCustom: true,
  //       type: 'USER',
  //       composition: [
  //         { id: '2426a96e-185a-4068-97d0-c98727b4231e', name: 'Analyst' },
  //         { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
  //       ],
  //       cretAt: '2026-03-05T05:39:34.373565Z',
  //       descrpt: 'Can access all systems',
  //     },
  //     {
  //       id: '43a6cb58-addf-4b91-bb98-5fd4c7fcb4c6',
  //       name: 'System Owner',
  //       isCustom: true,
  //       type: 'USER',
  //       composition: [
  //         { id: '2426a96e-185a-4068-97d0-c98727b4231e', name: 'Analyst' },
  //         { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
  //       ],
  //       cretAt: '2026-03-04T12:10:27.566334Z',
  //       descrpt: 'Can access all systems',
  //     },
  //     {
  //       id: 'd81db101-1c67-4a71-af65-2b1e03af037f',
  //       name: 'Unit manager',
  //       isCustom: true,
  //       type: 'USER',
  //       composition: [
  //         { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
  //       ],
  //       cretAt: '2026-03-04T12:00:36.190105Z',
  //       descrpt: 'Can view all units',
  //     },
  //     {
  //       id: '16463f55-fa08-4726-bdaf-b7e2efe79213',
  //       name: 'Unit Owner',
  //       isCustom: true,
  //       type: 'USER',
  //       composition: [
  //         { id: '2426a96e-185a-4068-97d0-c98727b4231e', name: 'Analyst' },
  //         { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
  //       ],
  //       cretAt: '2026-03-04T12:04:57.062940Z',
  //       descrpt: 'Can access all systems',
  //     },
  //   ];
  // }

  //  Get all roles
  getRolesList(): Observable<ApiResult<RoleListModel>> {
    // return of({ code: 200, data: { roles: this.mockRoles } }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(RoleMapper.fromListApi(res.data.roles))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .get<any>(`${this.baseUrl}/v1/units/roles/`, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(RoleMapper.fromListApi(res.data.roles))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Get role details
  getRoleDetails(roleId: string): Observable<ApiResult<RoleDetailsModel>> {
    // const mockData: RoleDetailsApiResponse = {
    //   id: '41d56cee-d1cc-4285-88fe-020e9ed14614',
    //   name: 'System Owner e',
    //   isCustom: true,
    //   type: 'USER',
    //   composition: [
    //     { id: '2426a96e-185a-4068-97d0-c98727b4231e', name: 'Analyst' },
    //     { id: 'f8e064cb-1b17-4725-b791-d5e047ee3eaa', name: 'Viewer' },
    //   ],
    //   cretAt: '2026-03-17T12:55:48.713975Z',
    //   descrpt: 'Can access all systems',
    // };
    // return of({ code: 200, data: mockData }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .get<any>(`${this.baseUrl}/v1/units/roles/${roleId}/`, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Add role
  addRole(
    data: Pick<RoleDetailsModel, 'roleName' | 'description' | 'composition'>,
  ): Observable<ApiResult<RoleDetailsModel>> {
    const payload = RoleMapper.toPayload(data); // mapper converts to BE request shape
    console.log('Adding role with payload:', payload);
    // const mockData: RoleDetailsApiResponse = {
    //   id: '41d56cee-d1cc-4285-88fe-020e9ed14614',
    //   name: payload.name,
    //   isCustom: true,
    //   type: 'USER',
    //   composition: payload.predefinedRoles.map((id) => ({
    //     id,
    //     name: this.mockRoles.find((r) => r.id === id)?.name ?? id,
    //   })),
    //   cretAt: new Date().toISOString(),
    //   descrpt: payload.description,
    // };
    // return of({ code: 201, data: mockData }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );

    // Real:
    return this.http
      .post<any>(`${this.baseUrl}/v1/units/roles/`, payload, this.httpOptions)
      .pipe(
        map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Update role
  updateRole(
    roleId: string,
    data: Partial<
      Pick<RoleDetailsModel, 'roleName' | 'description' | 'composition'>
    >,
  ): Observable<ApiResult<RoleDetailsModel>> {
    // Build partial payload — only include provided fields
    const payload: Partial<{
      name: string;
      description: string;
      predefinedRoles: string[];
    }> = {};
    if (data.roleName !== undefined) payload.name = data.roleName;
    if (data.description !== undefined) payload.description = data.description;
    if (data.composition !== undefined)
      payload.predefinedRoles = data.composition.map((c) => c.id);
    console.log('Updating role with payload:', payload);

    // const mockData: RoleDetailsApiResponse = {
    //   id: roleId,
    //   name: payload.name ?? 'Updated Role',
    //   isCustom: true,
    //   type: 'USER',
    //   composition: (payload.predefinedRoles ?? []).map((id) => ({
    //     id,
    //     name: this.mockRoles.find((r) => r.id === id)?.name ?? id,
    //   })),
    //   cretAt: new Date().toISOString(),
    //   descrpt: payload.description ?? '',
    // };
    // return of({ code: 200, data: mockData }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );

    // Real:
    return this.http
      .patch<any>(
        `${this.baseUrl}/v1/units/roles/edit/${roleId}/`,
        payload,
        this.httpOptions,
      )
      .pipe(
        map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Delete role
  deleteRole(roleId: string): Observable<ApiResult<void>> {
    console.log('Deleting role with ID:', roleId);
    // return of({ code: 200 }).pipe(
    //   delay(10),
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .delete<any>(
        `${this.baseUrl}/v1/units/roles/${roleId}/`,
        this.httpOptions,
      )
      .pipe(
        map(() => ApiResult.ok(undefined as void)),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  //  Clone role
  cloneRole(roleId: string): Observable<ApiResult<RoleDetailsModel>> {
    console.log('Cloning role with ID:', roleId);
    // const source = this.mockRoles.find((r) => r.id === roleId);
    // console.log('Cloning role with ID:', roleId, 'Source role:', source);
    // const mockData: RoleDetailsApiResponse = {
    //   id: '41d56cee-d1cc-4285-88fe-020e9ed14614',
    //   name: `Copy of ${source?.name ?? 'Role'}`,
    //   isCustom: true,
    //   type: 'USER',
    //   composition: source?.composition ?? [],
    //   cretAt: new Date().toISOString(),
    //   descrpt: source?.descrpt ?? '',
    // };
    // return of({ code: 201, data: mockData }).pipe(
    //   delay(10),
    //   map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
    //   catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    // );
    // Real:
    return this.http
      .post<any>(
        `${this.baseUrl}/v1/units/roles/clone/${roleId}/`,
        {},
        this.httpOptions,
      )
      .pipe(
        map((res) => ApiResult.ok(RoleMapper.fromApi(res.data))),
        catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
      );
  }

  // ________ Rules management API's (unit specific means rules comes under single unit ________
 
  // List of Rules under A unit
  getRulesList(unitId: string): Observable<ApiResult<RuleListModel>> {
    // mock response
    const mockResponse = {
      status: 'success',
      code: 200,
      message: 'OK',
      data: {
        rules: [
          {
            ruleId: '254a73b8-0996-48c1-b081-661ad13c1cef',
            name: 'Access asset s',
            rolename: 'Viewer',
            groups: [
              {
                groupId: '0066508e-3154-4491-9d1a-9278c8a1ed87',
                subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
                moduleName: 'Billings',
                resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
              },
              {
                groupId: '10bcbc3a-3ef0-47a4-a5d1-ed61552714be',
                subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
                moduleName: 'Asset',
                resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
              },
              {
                groupId: '43ac8dfe-e4da-4ce8-b163-9948ee2c8bdf',
                subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
                moduleName: 'Billings',
                resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
              },
              {
                groupId: '499bae98-3068-4671-8095-28101243b17b',
                subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
                moduleName: 'Asset',
                resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
              },
            ],
            category: 'rule_creation',
            description: '',
          },
        ],
      },
      meta: {
        count: 1,
        next: null,
        previous: null,
      },
      requestId: '22f8fa55-21da-47d5-b423-ab843ccff6cf',
      timestamp: '2026-03-20T11:12:02Z',
    };

    return of(mockResponse.data).pipe(
      delay(10),
      map((res) => ApiResult.ok(RuleMapper.fromListApi(res.rules))),
      catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    );
    // return this.http.get<any>(`${this.baseUrl}/v1/units/${unitId}/rules/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(res.data)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    //  );
  }

  // Single Rule details under a unit
  getRuleDetails(unitId: string, ruleId: string): Observable<ApiResult<RuleDetailsModel>> {
    // mock response
    const mockResponse = {
      status: 'success',
      code: 200,
      message: 'OK',
      data: {
        ruleId: '72e6aed3-e118-4b5a-92f0-bce9a9b89cc8',
        name: 'Access asset s',
        rolename: 'Viewer',
        groups: [
          {
            groupId: '22e1752e-0591-4635-9f0c-329084ac02cf',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '4ea54862-c232-473b-ad49-6da041d56bb6',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '62000ad0-5986-4fa9-aaf1-26462bf6497d',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
          {
            groupId: 'eb93c1a3-dcfb-43db-96fd-69825ac0f621',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
        ],
        category: 'rule_creation',
        description: '',
      },
      meta: {},
      requestId: 'aa05595f-295e-4d05-97ec-471d2e2299dc',
      timestamp: '2026-03-20T11:35:05Z',
    };
    return of(mockResponse.data).pipe(
      delay(10),
      map((res) => ApiResult.ok(RuleMapper.fromApi(res))),
      catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    );
    // return this.http.get<any>(`${this.baseUrl}/v1/units/${unitId}/rules/${ruleId}/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(res.data)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  // Add rule under a unit
  addRule(unitId: string, data: Pick<RuleDetailsModel, 'ruleName' | 'description' | 'roleName' | 'groups'>): Observable<ApiResult<RuleDetailsModel>> {
    const payload = RuleMapper.toPayload(data); // mapper converts to BE request shape
    console.log('Adding rule with payload:', payload);
    // mock response
    const mockResponse = {
      status: 'success',
      code: 201,
      message: 'Rule added successfully',
      data: {
        ruleId: '72e6aed3-e118-4b5a-92f0-bce9a9b89cc8',
        name: 'Access asset s',
        rolename: 'Viewer',
        groups: [
          {
            groupId: '22e1752e-0591-4635-9f0c-329084ac02cf',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '4ea54862-c232-473b-ad49-6da041d56bb6',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '62000ad0-5986-4fa9-aaf1-26462bf6497d',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
          {
            groupId: 'eb93c1a3-dcfb-43db-96fd-69825ac0f621',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
        ],
        category: 'rule_creation',
        description: '',
      },
      meta: {},
      requestId: '80d7fe12-e22c-4b05-8ffa-544941436066',
      timestamp: '2026-03-20T11:12:34Z',
    };
    return of(mockResponse.data).pipe(
      delay(10),
      map((res) => ApiResult.ok(RuleMapper.fromApi(res))),
      catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    );

    // return this.http.post<any>(`${this.baseUrl}/v1/units/${unitId}/rules/`, payload, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(res.data)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  // Update  rule under a unit
  updateRule(
    unitId: string,
    ruleId: string,
    data: Partial<Pick<RuleDetailsModel, 'ruleName' | 'description' | 'roleName' | 'groups'>>,
  ): Observable<ApiResult<RuleDetailsModel>> {
    // Build partial payload — only include provided fields
    const payload: Partial<{
      name: string;
      description: string;
      subjects: string[];
      resources: string[];
      role: string;
    }> = {};
    if (data.ruleName !== undefined) payload.name = data.ruleName;
    if (data.description !== undefined) payload.description = data.description;
    if (data.roleName !== undefined) payload.role = data.roleName;
    if (data.groups !== undefined) {
      payload.subjects = data.groups.map(g => g.subjectId);
      payload.resources = data.groups.map(g => g.resourceId);
    }
    console.log('Updating rule with payload:', payload);
    // mock response
    const mockResponse = {
      status: 'success',
      code: 200,
      message: 'Rule Updated successfully',
      data: {
        ruleId: '72e6aed3-e118-4b5a-92f0-bce9a9b89cc8',
        name: 'Access asset s',
        rolename: 'Viewer',
        groups: [
          {
            groupId: '22e1752e-0591-4635-9f0c-329084ac02cf',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '4ea54862-c232-473b-ad49-6da041d56bb6',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Billings',
            resourceId: '489b1f78-f5b7-4024-9c01-be83e3a8fe81',
          },
          {
            groupId: '62000ad0-5986-4fa9-aaf1-26462bf6497d',
            subjectId: '9b9528d1-b47c-4ce2-9298-6eb543373fa3',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
          {
            groupId: 'eb93c1a3-dcfb-43db-96fd-69825ac0f621',
            subjectId: '8aafc6d9-1c4a-4f51-9f7f-53d7c8292b5a',
            moduleName: 'Asset',
            resourceId: 'e8b0ab7d-c994-47ba-936a-435d1f333d7e',
          },
        ],
        category: 'rule_creation',
        description: '',
      },
      meta: {},
      requestId: '80d7fe12-e22c-4b05-8ffa-544941436066',
      timestamp: '2026-03-20T11:12:34Z',
    };
    return of(mockResponse.data).pipe(
      delay(10),
      map((res) => ApiResult.ok(RuleMapper.fromApi(res))),
      catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    );

    // real
    // return this.http.patch<any>(`${this.baseUrl}/v1/units/${unitId}/rules/${ruleId}/`, payload, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(res.data)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  // Delete  rule under a unit
  //delete =>  /api/v1/units/<unitId>/rules/<ruleId>/
  deleteRule(unitId: string, ruleId: string): Observable<ApiResult<void>> {
    // mock response
    const mockResponse = {
      status: 'success',
      code: 204,
      message: 'Rule deleted successfully',
      data: {},
      meta: {},
      requestId: '6de11a01-382a-4eb7-87f0-6d0a6c241bc6',
      timestamp: '2026-03-20T12:17:29Z',
    };
    return of(ApiResult.ok(mockResponse.data)).pipe(
      delay(10),
      map(() => ApiResult.ok(undefined as void)),
      catchError((err) => of(ApiResult.fail(mapHttpError(err)))),
    );
    // return this.http.delete<any>(`${this.baseUrl}/v1/units/${unitId}/rules/${ruleId}/`, this.httpOptions).pipe(
    //   map(() => ApiResult.ok(undefined as void)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }
}
