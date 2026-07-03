// services/collaborator-service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { ApiResult }            from '../dto/interfaces/api-result.interface';

import {
  MemberListApiResponse,
  MemberApiResponse,
  AcceptInvitationApiResponse,
  MemberInvitationSentApiResponse,
  PendingInvitationApiResponse,
  TeamListApiResponse,
  TeamDetailApiResponse,
  MemberInvitationRequest,
  CreateTeamRequest,
  ModifyTeamRequest,
} from '../dto/interfaces/collaborator.interface';
import { environment } from '../../environments/environment';

import {
  MemberListModel,
  AcceptedMembershipModel,
  SentInvitationModel,
  PendingInvitationListModel,
  TeamListModel,
  TeamDetailModel,
} from '../dto/models/collaborator.model';

import {
  MemberMapper,
  MemberInvitationMapper,
  TeamMapper,
  mapHttpError,
} from '../dto/mappers/collaborator.mapper';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {

  private get httpOptions() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    return environment.apiUrl;
  }

  // ─────────────────────────────────────────────
  //  Member APIs
  // ─────────────────────────────────────────────

  /** All members across all units under the account */
  getAllMembersAccount(): Observable<ApiResult<MemberListModel>> {
    const mock: MemberListApiResponse = {
      members: [
        { id: '0582ac2e-77ec-4580-b502-8b48643e117d', email: 'vijayxavier1234@gmail.com', name: 'vijay test',      type: 'unit_member', dateJoined: '2026-03-16T09:03:03.736470Z', status: 'Active', memberIn: 'unit' },
        { id: '5f9921a3-b649-48cd-9971-0277278e9faf', email: 'vijayxavier1237@gmail.com', name: 'vijay sssdcsds', type: 'unit_member', dateJoined: '2026-03-16T09:15:48.064212Z', status: 'Active', memberIn: 'unit' },
        { id: '29e0ecbb-4fde-4555-8de3-a16bd2bbc77e', email: 'vijayxavier1236@gmail.com', name: 'vijay sssdcds',  type: 'unit_member', dateJoined: '2026-03-16T09:19:54.593472Z', status: 'Active', memberIn: 'unit' },
        { id: '44786937-5988-4d86-93bb-02faff66e1ae', email: 'vijayxavier1237@gmail.com', name: 'vijay sssdcsds', type: 'team_member', dateJoined: '2026-03-16T09:15:48.125829Z', status: 'Active', memberIn: 'team' },
        { id: 'cc392083-c919-4842-b953-bf756d18a650', email: 'vijayxavier1236@gmail.com', name: 'vijay sssdcds',  type: 'team_member', dateJoined: '2026-03-16T09:19:54.614697Z', status: 'Active', memberIn: 'team' },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberMapper.fromApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/members/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberMapper.fromApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Members under a specific unit */
  getMembersByUnit(unitId: string): Observable<ApiResult<MemberListModel>> {
    const mock: MemberListApiResponse = {
      members: [
        { id: 'b3f35902-9899-42de-bbdb-411849bc2408', email: 'pradeepsahu92546@gmail.com', name: 'pradeep new mohanty', type: 'owner', dateJoined: '2026-03-09T07:40:41.390222Z', status: '', memberIn: 'unit' },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberMapper.fromApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/${unitId}/members/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberMapper.fromApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Invite a member to a unit */
  inviteMemberToUnit(
    data: Pick<MemberInvitationRequest, 'email' | 'teamId' | 'rules'>,
  ): Observable<ApiResult<SentInvitationModel>> {
    const mock: MemberInvitationSentApiResponse = {
      id:        '903237e7-f553-468f-b301-12ccd026af58',
      token:     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresAt: '2026-03-23T08:59:17.362112Z',
      invitedBy: 'pradeep new mohanty',
      invitedAt: '2026-03-16T08:59:17.362401Z',
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberMapper.fromSentInviteApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.post<any>(`${this.baseUrl}/api/v1/units/members/invite/`, data, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberMapper.fromSentInviteApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Accept a unit invitation via token */
  acceptUnitInvitation(token: string): Observable<ApiResult<AcceptedMembershipModel>> {
    const mock: AcceptInvitationApiResponse = {
      id:               '29e0ecbb-4fde-4555-8de3-a16bd2bbc77e',
      unitId:           '00f3692b-47a7-4569-9d28-dd45f3a38fa8',
      userId:           '0b06bd4c-426d-4eb3-94dd-133bf1819b6b',
      type:             'unit_member',
      status:           'ACCEPTED',
      teamMembershipId: 'cc392083-c919-4842-b953-bf756d18a650',
      appliedRuleIds:   ['79e58452-9165-493f-b7d6-963da67ee351'],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberMapper.fromAcceptApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.post<any>(`${this.baseUrl}/api/v1/units/members/invitations/accept/`, { token }, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberMapper.fromAcceptApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Remove a member from a unit */
  removeMemberFromUnit(unitId: string, memberId: string): Observable<ApiResult<null>> {
    return of(null).pipe(
      delay(10),
      map(() => ApiResult.ok(null)),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.delete<any>(`${this.baseUrl}/api/v1/units/${unitId}/members/${memberId}/`, this.httpOptions).pipe(
    //   map(() => ApiResult.ok(null)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Leave a shared unit */
  leaveUnit(unitId: string): Observable<ApiResult<null>> {
    return of(null).pipe(
      delay(10),
      map(() => ApiResult.ok(null)),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.post<any>(`${this.baseUrl}/api/v1/units/${unitId}/me/leave/`, {}, this.httpOptions).pipe(
    //   map(() => ApiResult.ok(null)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Members under a specific team */
  memberListByTeam(unitId: string, teamId: string): Observable<ApiResult<MemberListModel>> {
    const mock: MemberListApiResponse = {
      members: [
        { id: '44786937-5988-4d86-93bb-02faff66e1ae', email: 'vijayxavier1237@gmail.com', name: 'vijay sssdcsds', type: 'team_member', dateJoined: '2026-03-16T09:15:48.125829Z', status: 'Active', memberIn: 'team' },
        { id: 'cc392083-c919-4842-b953-bf756d18a650', email: 'vijayxavier1236@gmail.com', name: 'vijay sssdcds',  type: 'team_member', dateJoined: '2026-03-16T09:19:54.614697Z', status: 'Active', memberIn: 'team' },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberMapper.fromApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/${teamId}/members/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberMapper.fromApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  // ─────────────────────────────────────────────
  //  Invitation APIs
  // ─────────────────────────────────────────────

  /** All pending invitations under a unit */
  pendingInvitationbyUnit(unitId: string): Observable<ApiResult<PendingInvitationListModel>> {
    const mock: PendingInvitationApiResponse[] = [
      { id: '8a1c425c', email: 'vijaycriss123@gmail.com',  unitName: 'Plant4', status: 'PENDING', invitedBy: 'pradeep new mohanty', expiryDate: '2026-03-23T08:59:03.237998Z', createdAt: '2026-03-16T08:59:03.238445Z', teamName: null },
      { id: '72ce386a', email: 'vijaycriss1234@gmail.com', unitName: 'Plant4', status: 'PENDING', invitedBy: 'pradeep new mohanty', expiryDate: '2026-03-23T07:07:21.823037Z', createdAt: '2026-03-16T07:07:21.823405Z', teamName: null },
      { id: 'bebecec3', email: 'vijaycriss1234@gmail.com', unitName: 'Plant4', status: 'PENDING', invitedBy: 'pradeep new mohanty', expiryDate: '2026-03-23T07:06:22.833660Z', createdAt: '2026-03-16T07:06:22.833942Z', teamName: null },
    ];
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberInvitationMapper.fromApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/${unitId}/invitations/?status=PENDING`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberInvitationMapper.fromApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Resend invitation link */
  resendInvitationToUser(invitationId: string): Observable<ApiResult<PendingInvitationListModel>> {
    const mock: PendingInvitationApiResponse = {
      id:         '8a1c425c',
      email:      'vijaycriss123@gmail.com',
      unitName:   'Plant4',
      status:     'PENDING',
      invitedBy:  'pradeep new mohanty',
      expiryDate: '2026-03-23T13:03:53.908273Z',
      createdAt:  '2026-03-16T08:59:03.238445Z',
      teamName:   null,
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(MemberInvitationMapper.fromApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.post<any>(`${this.baseUrl}/api/v1/units/invitations/${invitationId}/resend/`, {}, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(MemberInvitationMapper.fromApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Revoke a pending invitation */
  revokeInvitation(invitationId: string): Observable<ApiResult<null>> {
    return of(null).pipe(
      delay(10),
      map(() => ApiResult.ok(null)),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.delete<any>(`${this.baseUrl}/api/v1/units/invitations/${invitationId}/revoke/`, this.httpOptions).pipe(
    //   map(() => ApiResult.ok(null)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  // ─────────────────────────────────────────────
  //  Team APIs
  // ─────────────────────────────────────────────

  /** All teams across all units under the account */
  teamsByAccount(): Observable<ApiResult<TeamListModel>> {
    const mock: TeamListApiResponse = {
      teams: [
        { id: '6ebe40a0-5642-4c81-b0e5-4740cd624b6f', name: 'Test one Teams', unitName: 'Plant4', cretAt: '2026-03-16T07:36:54.683676Z', descrpt: 'Handles all unit-level infrastructure security' },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(TeamMapper.fromListApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/teams/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(TeamMapper.fromListApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Teams under a specific unit */
  teamsByUnit(unitId: string): Observable<ApiResult<TeamListModel>> {
    const mock: TeamListApiResponse = {
      teams: [
        { id: '6ebe40a0-5642-4c81-b0e5-4740cd624b6f', name: 'Test one Teams',  unitName: 'Plant4', cretAt: '2026-03-16T07:36:54.683676Z', descrpt: 'Handles all unit-level infrastructure security' },
        { id: '9e807318-7bf5-4d10-8c31-95ccdf94e60f', name: 'Test one Teamsw', unitName: 'Plant4', cretAt: '2026-03-16T09:57:00.481567Z', descrpt: 'Handles all unit-level infrastructure security' },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(TeamMapper.fromListApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(TeamMapper.fromListApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Full team details including members and rules */
  teamDetailsByUnit(unitId: string, teamId: string): Observable<ApiResult<TeamDetailModel>> {
    const mock: TeamDetailApiResponse = {
      team:         { id: 'ac1d0ba8-6dc8-4401-b61c-f9f7fd0d163d', name: 'Cloud Security Team', unitName: 'plant3', cretAt: '2026-03-05T07:24:31.664287Z', descrpt: 'Handles all unit-level infrastructure security' },
      totalMembers: 0,
      totalRules:   1,
      members:      [],
      rules: [
        { ruleId: '41919c3a-e80f-4127-85ab-1f6806048a12', roleName: 'Copy of Unit Owner', moduleName: '', resourceId: null, category: 'team', description: null },
      ],
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(TeamMapper.fromDetailApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.get<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/${teamId}/`, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(TeamMapper.fromDetailApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Create a new team under a unit */
  createTeamUnderUnit(
    unitId: string,
    data: Pick<CreateTeamRequest, 'name' | 'description' | 'rules' | 'initialMembers'>,
  ): Observable<ApiResult<TeamDetailModel>> {
    const mock: TeamDetailApiResponse = {
      team:         { id: '9e807318-7bf5-4d10-8c31-95ccdf94e60f', name: data.name, unitName: 'plant4', cretAt: new Date().toISOString(), descrpt: data.description },
      totalMembers: 0,
      totalRules:   data.rules.length,
      members:      [],
      rules:        data.rules.map((r, i) => ({ ruleId: `rule-${i}`, roleName: r.roleId, moduleName: '', resourceId: r.resourceId, category: 'team', description: null })),
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(TeamMapper.fromDetailApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.post<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/`, data, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(TeamMapper.fromDetailApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Modify an existing team */
  modifyTeamUnderUnit(
    unitId: string,
    teamId: string,
    data: Pick<ModifyTeamRequest, 'name' | 'description' | 'rules'>,
  ): Observable<ApiResult<TeamDetailModel>> {
    const mock: TeamDetailApiResponse = {
      team:         { id: teamId, name: data.name, unitName: 'plant3', cretAt: new Date().toISOString(), descrpt: data.description },
      totalMembers: 0,
      totalRules:   data.rules.length,
      members:      [],
      rules:        data.rules.map((r, i) => ({ ruleId: `rule-${i}`, roleName: r.roleId, moduleName: '', resourceId: r.resourceId, category: 'team', description: null })),
    };
    return of(mock).pipe(
      delay(10),
      map(res => ApiResult.ok(TeamMapper.fromDetailApi(res))),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.patch<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/${teamId}/`, data, this.httpOptions).pipe(
    //   map(res => ApiResult.ok(TeamMapper.fromDetailApi(res.data))),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }

  /** Delete a team from a unit */
  deleteTeamFromUnit(unitId: string, teamId: string): Observable<ApiResult<null>> {
    return of(null).pipe(
      delay(10),
      map(() => ApiResult.ok(null)),
      catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    );
    // Real:
    // return this.http.delete<any>(`${this.baseUrl}/api/v1/units/${unitId}/teams/${teamId}/`, this.httpOptions).pipe(
    //   map(() => ApiResult.ok(null)),
    //   catchError(err => of(ApiResult.fail(mapHttpError(err)))),
    // );
  }
}