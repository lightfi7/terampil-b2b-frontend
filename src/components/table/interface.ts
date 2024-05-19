import { OptionData } from "../form/interface";

export type XTableItemType = 'number' | 'string';
export type XTableSortValue = 'asc' | 'desc' | undefined;
export interface XTableFilterValue {
  key: string
  value: any
}

export interface XTableFilterInput {
  type: 'input'
  value?: any
}

export interface XTableFilterInputNumber {
  type: 'number'
  value?: number
}

export interface XTableFilterDate {
  type: 'date'
  value?: any
}

export interface XTableFilterSearch {
  type: 'dropdown'
  value?: any
  options?: OptionData[]
}

export type XTableFilterType = XTableFilterInput | XTableFilterDate | XTableFilterSearch | XTableFilterInputNumber;

export interface XTableHeaderItem {
  label: string
  key: string
  hide?: boolean
  w?: number | string
  normal?: boolean
  renderValue?(value: any): any
  type?: XTableItemType
  sort?: XTableSortValue
  filter?: XTableFilterType
  onFilterSort?(sort: XTableSortValue, filter: XTableFilterValue): void
}

export interface XTableActionItem<T> {
  label: string
  type?: 'normal' | 'warning' | 'danger',
  disabled?(row: T): boolean
  onClick?(row: T): void
}

export interface XTableData<T> {
  header: XTableHeaderItem[]
  data: T[]
  onRowClick?(row: T): void
  action?: XTableActionItem<T>[]
}
