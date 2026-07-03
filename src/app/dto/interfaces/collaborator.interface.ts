// dto/interfaces/collaborator.interface.ts
// Represents the EXACT field names returned/sent by the backend.


// ______  Member — Response interfaces ______

export interface MemberApiResponse {
  id:         string;
  email:      string;
  name:       string;
  type:       string;       // 'owner' | 'unit_member' | 'team_member'
  dateJoined: string;       // ISO datetime
  status:     string;       // 'Active' | '' | 'ACCEPTED'
  memberIn:   string;       // 'unit' | 'team'
}

export interface MemberListApiResponse {
  members: MemberApiResponse[];
}

// acceptUnitInvitation response shape (different from member list item)
export interface AcceptInvitationApiResponse {
  id:               string;
  unitId:           string;
  userId:           string;
  type:             string;
  status:           string;
  teamMembershipId: string;
  appliedRuleIds:   string[];
}

// inviteMemberToUnit response shape
export interface MemberInvitationSentApiResponse {
  id:          string;
  token:       string;
  expiresAt:   string;
  invitedBy:   string;
  invitedAt:   string;
}


//  Pending Invitation — Response interfaces


export interface PendingInvitationApiResponse {
  id:          string;
  email:       string;
  unitName:    string;
  status:      string;      // 'PENDING'
  invitedBy:   string;
  expiryDate:  string;      // ISO datetime
  createdAt:   string;      // ISO datetime
  teamName:    string | null;
}


// ___ Team — Response interfaces ___


export interface TeamApiResponse {
  id:       string;
  name:     string;
  unitName: string;
  cretAt:   string;         // BE typo — keep as-is in interface
  descrpt:  string;         // BE typo — keep as-is in interface
}

export interface TeamRuleApiResponse {
  ruleId:      string;
  roleName:    string;
  moduleName:  string;
  resourceId:  string | null;
  category:    string;
  description: string | null;
}

export interface TeamListApiResponse {
  teams: TeamApiResponse[];
}

export interface TeamDetailApiResponse {
  team:         TeamApiResponse;
  totalMembers: number;
  totalRules:   number;
  members:      MemberApiResponse[];
  rules:        TeamRuleApiResponse[];
}


//  Request interfaces


export interface RuleRequest {
  roleId:     string;
  resourceId: string | null;
}

export interface MemberInvitationRequest {
  email:  string;
  teamId: string;
  rules:  RuleRequest[];
}

export interface CreateTeamRequest {
  name:           string;
  description:    string;
  rules:          RuleRequest[];
  initialMembers: string[];   // array of member UUIDs
}

export interface ModifyTeamRequest {
  name:        string;
  description: string;
  rules:       RuleRequest[];
}