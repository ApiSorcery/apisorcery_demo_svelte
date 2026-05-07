export interface SelectOption {
  value: any;
  label: string;
  color?: string;
}

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export interface QueryModel {
  code?: string;
  name?: string;
  status?: boolean | null;
}

export interface UserFormModel {
  id?: number;
  code: string;
  name: string;
  email: string;
  gender?: number;
  avatar?: string;
  address?: string;
  status?: boolean;
}

export type OperateType = 'add' | 'edit' | 'view';
