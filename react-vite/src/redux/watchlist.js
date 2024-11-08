import { normalizer } from './utils';

/** Action Type Constants: */

const LOAD_WATCHLIST = "watchlists/LOAD_WATCHLISTS"
const ADD_TO_WATCHLIST = 'watchlist/ADD_TO_WATCHLIST'
const REMOVE_FROM_WATCHLIST = 'watchlist/REMOVE_FROM_WATCHLIST'


/**  Action Creators: */
const loadWatchlist = (watchlist) => {
    return {
        type: LOAD_WATCHLIST,
        payload: watchlist
    }
}

const add_to_watchlist = (stock) => {
    return {
        type: ADD_TO_WATCHLIST,
        payload: stock
    }
}

const remove_from_watchlisth = 