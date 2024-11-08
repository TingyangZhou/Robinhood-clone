import { normalizer } from './utils';

const GET_ALL_STOCKS = 'stocks/getAll';

const getAllStocks = (stocks) => {
    return {
        type: GET_ALL_STOCKS,
        stocks,
    };
};

export const getAllStocksThunk = () => async (dispatch) => {
    const res = await fetch('/api/stocks');
    console.log("--------------")
    console.log(res)
    console.log("--------------")
    if (res.ok) {
        console.log(res.body)
        const data = await res.json();
        dispatch(getAllStocks(data.stocks));
    } else {
        console.log(res.json())
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