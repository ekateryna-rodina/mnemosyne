import {applyMiddleware, createStore} from 'redux';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {AppActionTypes} from './rootActionTypes';
import rootReducer from './rootReducer';

export type AppState = ReturnType<typeof rootReducer>;
const middleware = applyMiddleware(
  thunk as ThunkMiddleware<AppState, AppActionTypes>,
);

const store = createStore(rootReducer, {}, middleware);
export default store;
