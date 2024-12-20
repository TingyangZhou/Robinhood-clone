// react-vite/src/redux/store.js

import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import stocksReducer from './stocks';
import watchlistReducer from './watchlist';
import userInfoReducer from './users';
import portfolioReducer from './portfolio';

const rootReducer = combineReducers({
    session: sessionReducer,
    stocks: stocksReducer,
    watchlist: watchlistReducer,
    userInfo: userInfoReducer,
    portfolio: portfolioReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import('redux-logger')).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
