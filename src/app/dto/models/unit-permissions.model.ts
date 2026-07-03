// models/unit-permissions.model.ts
// Clean UI models — components only import from here, never from api interfaces.


// ____ role models____
export interface RoleDetailsModel {
  roleId:      string;      
  roleName:    string;     
  isCustom:    boolean;
  type:        string;      // "predefined" or "custom"
  composition: CompositionItemModel[];
  createdAt:   string;     
  description: string;      
}

export interface CompositionItemModel {
  id:   string;
  name: string;
}

export interface RoleListModel {
  roles: RoleDetailsModel[];
}

// ____ rule models____

export interface RuleDetailsModel {
  ruleId: string;
  ruleName: string;
  roleName: string; // the role this rule is associated with
  groups: GroupModel[];
  category: string;
  description: string;
}

export interface GroupModel {
  groupId: string;
  subjectId: string;
  moduleName: string;
  resourceId: string;
}

export interface RuleListModel {
  rules: RuleDetailsModel[];
}
