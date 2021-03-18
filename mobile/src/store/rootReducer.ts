import {combineReducers} from 'redux';
import {searchReducer} from './search/SearchReducer';
const rootReducer = combineReducers({
  search: searchReducer,
});

export default rootReducer;
