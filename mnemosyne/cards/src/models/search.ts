import { ICard } from "./card";
export interface IFilter {
  showPersonalOnly: boolean;
  tags: string[];
}
export interface IPager {
  page: number;
  perPageLimit: number;
  total: number;
}
export interface ISorting {
  asc: boolean;
}
export interface ISearch {
  cards: ICard[];
  pager: IPager;
}
