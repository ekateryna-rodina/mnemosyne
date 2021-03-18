import {Reducer} from 'redux';
import {
  SearchActionTypes,
  SEARCH_CARDS_BY_FAVORITES,
  SEARCH_CARDS_BY_TAGS,
  SEARCH_CARDS_BY_TERMS,
} from './models/actions';
import {ISearchCards} from './models/Search';

const initialState: ISearchCards = {
  terms: [],
  isFavorite: false,
  tags: [],
};

export const searchReducer: Reducer<ISearchCards, SearchActionTypes> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case SEARCH_CARDS_BY_TERMS:
      return {
        ...state,
        terms: action.payload,
      };
    case SEARCH_CARDS_BY_TAGS:
      return {
        ...state,
        tags: action.payload,
      };
    case SEARCH_CARDS_BY_FAVORITES:
      return {
        ...state,
        isFavorite: action.payload,
      };
    default:
      return state;
  }
};
