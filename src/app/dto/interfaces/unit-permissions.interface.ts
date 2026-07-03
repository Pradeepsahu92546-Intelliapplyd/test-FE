// src/app/dto/interfaces/unit-permissions.interface.ts


// _______ Role management interfaces _______

// Role API response shapes
export interface RoleListItemApiResponse {
  roles: RoleDetailsApiResponse[];
}

export interface RoleDetailsApiResponse {
  id: string;
  name: string;
  isCustom: boolean;
  type: string; // "predefined" or "custom"
  composition: CompositionItemResponse[];
  cretAt: string;
  descrpt: string; // description of the role
}

export interface CompositionItemResponse {
  id: string;
  name: string;
}


// _______ Request interfaces _______

// add Role request body Both for add and update role
export interface RoleRequest {
  name: string;
  description: string;
  predefinedRoles: string[]; // array of role IDs to include in this role
}



// _______ Rule management interfaces _______

// Rule API response shapes
export interface RuleListApiResponse {
  rules: RuleDetailsApiResponse[];
}

export interface RuleDetailsApiResponse {
  ruleId: string;
  name: string;
  rolename: string; //each rule is associated with a single role, this is the name of that role
  groups: groupInterface[]; // list of group names this rule applies to
  category: string; // e.g. "access", "edit", etc - used for UI grouping
  description: string; // description of the rule
}

export interface groupInterface {
  groupId: string;
  subjectId: string;
  moduleName: string;
  resourceId: string;
}

// rule request body 
export interface RuleRequest {
  name: string;
  description: string; 
  subjects: string[]; // only member id's or only team id's
  resources: string[];
  role: string; // the role this rule is associated with
}

