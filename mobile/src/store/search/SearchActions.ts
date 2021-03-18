import {
  SEARCH_CARDS_BY_FAVORITES,
  SEARCH_CARDS_BY_TAGS,
  SEARCH_CARDS_BY_TERMS,
} from './models/actions';
import {ITag} from './models/Search';

export const searchByTags = (tags: ITag[]) => ({
  type: SEARCH_CARDS_BY_TAGS,
  payload: tags,
});

export const searchByTerms = (terms: string[]) => ({
  type: SEARCH_CARDS_BY_TERMS,
  payload: terms,
});

export const searchByFavorites = (isFavorite: boolean) => ({
  type: SEARCH_CARDS_BY_FAVORITES,
  payload: isFavorite,
});
