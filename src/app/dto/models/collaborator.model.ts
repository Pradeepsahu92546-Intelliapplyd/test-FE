// dto/models/collaborator.model.ts
// Clean UI models — components only import from here, never from api interfaces.


// ____ Member _____


export interface MemberModel {
  id:         string;
  email:      string;
  name:       string;
  memberType: string;       // normalised: 'Owner' | 'Unit Member' | 'Team Member'
  dateJoined: Date | null;
  status:     string;
  memberIn:   string;       // 'unit' | 'team'
}

export interface MemberListModel {
  members: MemberModel[];
}

// Returned after accepting an invitation
export interface AcceptedMembershipModel {
  id:               string;
  unitId:           string;
  userId:           string;
  memberType:       string;
  status:           string;
  teamMembershipId: string;
  appliedRuleIds:   string[];
}

// Returned after sending an invitation
export interface SentInvitationModel {
  id:        string;
  token:     string;
  expiresAt: Date | null;
  invitedBy: string;
  invitedAt: Date | null;
}


//  Pending Invitation


export interface PendingInvitationModel {
  id:        string;
  email:     string;
  unitName:  string;
  status:    string;
  invitedBy: string;
  expiryDate: Date | null;
  createdAt:  Date | null;
  teamName:   string | null;
}

export interface PendingInvitationListModel {
  invitations: PendingInvitationModel[];
}


// _____ Team _____


export interface TeamRuleModel {
  ruleId:      string;
  roleName:    string;
  moduleName:  string;
  resourceId:  string | null;
  category:    string;
  description: string | null;
}

export interface TeamModel {
  id:          string;
  name:        string;
  unitName:    string;
  createdAt:   Date | null;   // normalised from BE's cretAt typo
  description: string;        // normalised from BE's descrpt typo
}

export interface TeamListModel {
  teams: TeamModel[];
}

export interface TeamDetailModel {
  team:         TeamModel;
  totalMembers: number;
  totalRules:   number;
  members:      MemberModel[];
  rules:        TeamRuleModel[];
}