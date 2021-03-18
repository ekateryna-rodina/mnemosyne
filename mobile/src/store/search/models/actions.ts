import {ITag} from './Search';

export const SEARCH_CARDS_BY_TERMS = 'SEARCH_CARDS_BY_TERMS';
export const SEARCH_CARDS_BY_TAGS = 'SEARCH_CARDS_BY_TAGS';
export const SEARCH_CARDS_BY_FAVORITES = 'SEARCH_CARDS_BY_FAVORITES';

interface SearchCardsByTermsAction {
  type: typeof SEARCH_CARDS_BY_TERMS;
  payload: string[];
}

interface SearchCardsByTagsAction {
  type: typeof SEARCH_CARDS_BY_TAGS;
  payload: ITag[];
}
interface SearchCardsByFavoritesAction {
  type: typeof SEARCH_CARDS_BY_FAVORITES;
  payload: boolean;
}

export type SearchActionTypes =
  | SearchCardsByTermsAction
  | SearchCardsByTagsAction
  | SearchCardsByFavoritesAction;
