export interface ITag {
  key: string;
  name: string;
}

export interface ISearchCards {
  terms: string[];
  isFavorite: boolean;
  tags: ITag[];
}
