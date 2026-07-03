// mappers/unit-permissions.mapper.ts
// ⚡ SINGLE MAPPING PLACE for all role/permission field translations.

import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiErrorCode } from '../interfaces/api-result.interface';

import {
  RoleDetailsModel,
  CompositionItemModel,
  RoleListModel,
  RuleDetailsModel,
  RuleListModel,
  GroupModel,
} from '../models/unit-permissions.model';
import {
  RoleDetailsApiResponse,
  CompositionItemResponse,
  RoleRequest,
  RuleDetailsApiResponse,
  RuleRequest,
  groupInterface,
} from '../interfaces/unit-permissions.interface';

//  Composition item
export class CompositionMapper {

  /** BE response item → CompositionItemModel (UI) */
  static fromApi(data: CompositionItemResponse): CompositionItemModel {
    return {
      id:   data.id,
      name: data.name,
    };
  }
}

//  Role
export class RoleMapper {

  /** Single BE role response → RoleDetailsModel (UI)
   *
   *  Field renames:
   *    id       → roleId
   *    name     → roleName
   *    cretAt   → createdAt   (BE typo kept in interface, normalised here)
   *    descrpt  → description (BE typo kept in interface, normalised here)
   */
  static fromApi(data: RoleDetailsApiResponse): RoleDetailsModel {
    return {
      roleId:      data.id,
      roleName:    data.name,
      isCustom:    data.isCustom,
      type:        data.type,
      composition: (data.composition ?? []).map(CompositionMapper.fromApi),
      createdAt:   data.cretAt   ?? '',   // ← BE field: cretAt
      description: data.descrpt  ?? '',   // ← BE field: descrpt
    };
  }

  /** Array of BE role responses → RoleListModel (UI) */
  static fromListApi(roles: RoleDetailsApiResponse[]): RoleListModel {
    return {
      roles: (roles ?? []).map(RoleMapper.fromApi),
    };
  }

  /** RoleDetailsModel (UI) → add/update role request body
   *
   *  Request fields:
   *    roleName    → name
   *    description → description  (same)
   *    composition → predefinedRoles (array of IDs only)
   */
  static toPayload(
    data: Pick<RoleDetailsModel, 'roleName' | 'description' | 'composition'>,
  ): RoleRequest {
    return {
      name:             data.roleName,
      description:      data.description,
      predefinedRoles:  data.composition.map(c => c.id),   // ← send IDs only
    };
  }
}


//  Group
export class GroupMapper {

  /** BE group response → GroupModel (UI) */
  static fromApi(data: groupInterface): GroupModel {
    return {
      groupId: data.groupId,
      subjectId: data.subjectId,
      moduleName: data.moduleName,
      resourceId: data.resourceId,
    };
  }
}

//  Rule
export class RuleMapper {

  /** Single BE rule response → RuleDetailsModel (UI)
   *
   *  Field renames:
   *    ruleId    → ruleId (same)
   *    name      → ruleName
   *    rolename  → roleName
   *    groups    → groups (mapped)
   *    category  → category (same)
   *    description → description (same)
   */
  static fromApi(data: RuleDetailsApiResponse): RuleDetailsModel {
    return {
      ruleId: data.ruleId,
      ruleName: data.name,
      roleName: data.rolename,
      groups: (data.groups ?? []).map(GroupMapper.fromApi),
      category: data.category ?? '',
      description: data.description ?? '',
    };
  }

  /** Array of BE rule responses → RuleListModel (UI) */
  static fromListApi(rules: RuleDetailsApiResponse[]): RuleListModel {
    return {
      rules: (rules ?? []).map(RuleMapper.fromApi),
    };
  }

  /** RuleDetailsModel (UI) → add/update rule request body
   *
   *  Request fields:
   *    ruleName   → name
   *    description → description (same)
   *    subjects   → subjects (array of subject IDs)
   *    resources  → resources (array of resource IDs)
   *    roleName   → role
   */
  static toPayload(
    data: Pick<RuleDetailsModel, 'ruleName' | 'description' | 'roleName' | 'groups'>,
  ): RuleRequest {
    // Extract subjects and resources from groups
    const subjects = data.groups.map(g => g.subjectId);
    const resources = data.groups.map(g => g.resourceId);

    return {
      name: data.ruleName,
      description: data.description,
      subjects: subjects,
      resources: resources,
      role: data.roleName,
    };
  }
}


//  HTTP Error → ApiError  (reused pattern)
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
    404: 'Role not found.',
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