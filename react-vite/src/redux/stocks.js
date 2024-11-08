import { normalizer } from './utils';

const GET_ALL_STOCKS = 'stocks/getAll';
const GET_ONE_STOCK = 'stocks/getOne';

const dummyStock = {
    "id": 1,
    "ticker": "TSLA",
    "company_name": "Tesla",
    "image_url": "fake_image_of_graph.png",
    "company_info": "Tesla, Inc., founded in 2003, is a leader in electric vehicles and clean energy...",
    "updated_price": 245.56,
    "Is_in_watchlist": true,
    "Is_in_portfolio": false
  }

const getAllStocks = (stocks) => {
    return {
        type: GET_ALL_STOCKS,
        payload: stocks,
    };
};

const getOneStock = (stock) => {
    return {
        type: GET_ONE_STOCK,
        payload: stock,
    };
};

export const getOneStockThunk = (stockId) => async (dispatch) => {
    const res = await fetch(`/api/stocks/${stockId}`);
    if (!res.ok) {
        const data = res.json();
        dispatch(getOneStock(data));
    } else {
        const errors = await res.json();
        return errors;
    }
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
            return {currentStock: state.currentStock, stocks: normalizer(payload)}
        case GET_ONE_STOCK:
            return {currentStock: payload, stocks: state.stocks}
        default:
            return state;
    }
}