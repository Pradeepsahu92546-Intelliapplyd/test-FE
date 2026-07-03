// dto/mappers/collaborator.mapper.ts
// SINGLE MAPPING PLACE for members, invitations, and teams.

import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiErrorCode } from '../interfaces/api-result.interface';

import {
  MemberApiResponse,
  MemberListApiResponse,
  AcceptInvitationApiResponse,
  MemberInvitationSentApiResponse,
  PendingInvitationApiResponse,
  TeamApiResponse,
  TeamRuleApiResponse,
  TeamListApiResponse,
  TeamDetailApiResponse,
} from '../interfaces/collaborator.interface';

import {
  MemberModel,
  MemberListModel,
  AcceptedMembershipModel,
  SentInvitationModel,
  PendingInvitationModel,
  PendingInvitationListModel,
  TeamModel,
  TeamRuleModel,
  TeamListModel,
  TeamDetailModel,
} from '../models/collaborator.model';


//  Member Mapper

export class MemberMapper {

  /** Single BE member item → MemberModel (UI) */
  static fromItem(data: MemberApiResponse): MemberModel {
    return {
      id:         data.id,
      email:      data.email,
      name:       data.name,
      memberType: MemberMapper.normaliseType(data.type),   // 'unit_member' → 'Unit Member'
      dateJoined: MemberMapper.toDate(data.dateJoined),
      status:     data.status ?? '',
      memberIn:   data.memberIn ?? '',
    };
  }

  /** Member list response → MemberListModel (UI) */
  static fromApi(data: MemberListApiResponse): MemberListModel {
    return {
      members: (data.members ?? []).map(MemberMapper.fromItem),
    };
  }

  /** acceptUnitInvitation response → AcceptedMembershipModel (UI) */
  static fromAcceptApi(data: AcceptInvitationApiResponse): AcceptedMembershipModel {
    return {
      id:               data.id,
      unitId:           data.unitId,
      userId:           data.userId,
      memberType:       MemberMapper.normaliseType(data.type),
      status:           data.status,
      teamMembershipId: data.teamMembershipId,
      appliedRuleIds:   data.appliedRuleIds ?? [],
    };
  }

  /** inviteMemberToUnit response → SentInvitationModel (UI) */
  static fromSentInviteApi(data: MemberInvitationSentApiResponse): SentInvitationModel {
    return {
      id:        data.id,
      token:     data.token,
      expiresAt: MemberMapper.toDate(data.expiresAt),
      invitedBy: data.invitedBy,
      invitedAt: MemberMapper.toDate(data.invitedAt),
    };
  }

  /** 'unit_member' → 'Unit Member' */
  private static normaliseType(type: string): string {
    if (!type) return '';
    return type
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private static toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}


//  Pending Invitation Mapper

export class MemberInvitationMapper {

  /** Single invitation item → PendingInvitationModel */
  static fromItem(data: PendingInvitationApiResponse): PendingInvitationModel {
    return {
      id:         data.id,
      email:      data.email,
      unitName:   data.unitName,
      status:     data.status,
      invitedBy:  data.invitedBy,
      expiryDate: MemberInvitationMapper.toDate(data.expiryDate),
      createdAt:  MemberInvitationMapper.toDate(data.createdAt),
      teamName:   data.teamName ?? null,
    };
  }

  /** Array of invitation items OR single item → PendingInvitationListModel
   *  (pendingInvitationByUnit returns an array directly;
   *   resendInvitationToUser returns a single object — handle both)
   */
  static fromApi(
    data: PendingInvitationApiResponse[] | PendingInvitationApiResponse,
  ): PendingInvitationListModel {
    if (Array.isArray(data)) {
      return { invitations: data.map(MemberInvitationMapper.fromItem) };
    }
    return { invitations: [MemberInvitationMapper.fromItem(data)] };
  }

  private static toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}


//  Team Mapper

export class TeamMapper {

  /** Single team summary → TeamModel
   *  Field renames:
   *    cretAt  → createdAt  (BE typo)
   *    descrpt → description (BE typo)
   */
  static fromTeamItem(data: TeamApiResponse): TeamModel {
    return {
      id:          data.id,
      name:        data.name,
      unitName:    data.unitName,
      createdAt:   TeamMapper.toDate(data.cretAt),   // ← BE field: cretAt
      description: data.descrpt ?? '',               // ← BE field: descrpt
    };
  }

  /** Single rule → TeamRuleModel */
  static fromRuleItem(data: TeamRuleApiResponse): TeamRuleModel {
    return {
      ruleId:      data.ruleId,
      roleName:    data.roleName,
      moduleName:  data.moduleName  ?? '',
      resourceId:  data.resourceId  ?? null,
      category:    data.category,
      description: data.description ?? null,
    };
  }

  /**
   * fromApi handles all three team response shapes:
   *   - TeamListApiResponse   { teams: [...] }           → TeamListModel
   *   - TeamDetailApiResponse { team: {...}, rules, ... } → TeamDetailModel
   *   - Union resolved at runtime by checking which keys are present
   */
  static fromApi(
    data: TeamListApiResponse | TeamDetailApiResponse,
  ): TeamListModel | TeamDetailModel {
    if ('teams' in data) {
      // List endpoint
      return TeamMapper.fromListApi(data as TeamListApiResponse);
    }
    // Detail endpoint
    return TeamMapper.fromDetailApi(data as TeamDetailApiResponse);
  }

  static fromListApi(data: TeamListApiResponse): TeamListModel {
    return {
      teams: (data.teams ?? []).map(TeamMapper.fromTeamItem),
    };
  }

  static fromDetailApi(data: TeamDetailApiResponse): TeamDetailModel {
    return {
      team:         TeamMapper.fromTeamItem(data.team),
      totalMembers: data.totalMembers ?? 0,
      totalRules:   data.totalRules   ?? 0,
      members:      (data.members ?? []).map(MemberMapper.fromItem),
      rules:        (data.rules   ?? []).map(TeamMapper.fromRuleItem),
    };
  }

  private static toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}


//  HTTP Error → ApiError

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
    message: (uiMessages[err.status] ?? beMessage )|| 'An unexpected error occurred.',
    status:  err.status,
  };
}