import { normalizer } from './utils';

const GET_ALL_STOCKS = 'stocks/getAll';

const getAllStocks = (stocks) => {
    return {
        type: GET_ALL_STOCKS,
        payload: stocks,
    };
};

export const getAllStocksThunk = () => async (dispatch) => {
    const res = await fetch('/api/stocks');
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllStocks(data.stocks));
    } else {
        const errors = await res.json();
        return errors;
    }
};

let initialState = {
    currentStock: {},
    stocks: {}
}

export default function stocksReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_ALL_STOCKS:
            return {currentStocks: state.currentStock, stocks: normalizer(payload)}
        default:
            return state;
    }
}