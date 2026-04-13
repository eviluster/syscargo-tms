// src/common/base/types/search.types.ts
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

export type ComparisonOperator = 
  | 'EQ'  // Equal
  | 'NE'  // Not Equal
  | 'GT'  // Greater Than
  | 'LT'  // Less Than
  | 'GTE' // Greater Than or Equal
  | 'LTE' // Less Than or Equal
  | 'LIKE' // Like
  | 'IN'  // In
  | 'NOT_IN' // Not In
  | 'IS_NULL' // Is Null
  | 'IS_NOT_NULL'; // Is Not Null

export type LogicalOperator = 'AND' | 'OR';

export type SortDirection = 'ASC' | 'DESC';

export interface FieldSelection {
  name: string;
  alias?: string;
}

export interface JoinCondition {
  table: string;
  alias: string;
  type: JoinType;
  condition: string;
  fields?: FieldSelection[];
  joins?: JoinCondition[];
}

export interface FilterCondition {
  field: string;
  operator: ComparisonOperator;
  value?: string;
  values?: string[];
  logicalOperator?: LogicalOperator;
}

export interface SortCondition {
  field: string;
  direction: SortDirection;
}

export interface SearchInput {
  mainTable: string;
  mainAlias: string;
  fields: FieldSelection[];
  joins?: JoinCondition[];
  filters?: FilterCondition[];
  sort?: SortCondition[];
  skip?: number;
  take?: number;
}