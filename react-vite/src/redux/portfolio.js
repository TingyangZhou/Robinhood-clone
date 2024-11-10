// app/api/portfolio.js

const GET_USER_STOCKS = 'portfolio/getUserStocks';
const ADD_USER_STOCK = 'portfolio/addUserStock';
const REMOVE_USER_STOCK = 'portfolio/removeUserStock';
const initialState = {
    userStocks: []
};

// Action Creators
export const getUserStocksAction = (userStocks) => {
    return {
        type: GET_USER_STOCKS,
        userStocks
    };
};

export const addUserStockAction = (stock) => {
    return {
        type: ADD_USER_STOCK,
        stock
    };
};

export const removeUserStockAction = (stockId) => {
    return {
        type: REMOVE_USER_STOCK,
        stockId
    };
};

// Thunk Actions
export const getUserStocksThunk = () => async (dispatch) => {
    const response = await fetch('/api/portfolio/current', {
        method: 'GET'
    });
    const data = await response.json();
    dispatch(getUserStocksAction(data.portfolio_stocks));
    return response;
};

export const addUserStockThunk = (stockId, stockData) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/${stockId}/current`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData)
    });
    const data = await response.json();
    dispatch(addUserStockAction(data.stock));
    return data;
};

export const removeUserStockThunk = (stockId) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/${stockId}/current`, {
        method: 'DELETE'
    });
    const data = await response.json();
    dispatch(removeUserStockAction(stockId));
    return data;
};



// Reducer
const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_STOCKS:
            return {...state, userStocks: action.userStocks};
        case ADD_USER_STOCK:
            return {...state, userStocks: [...state.userStocks, action.stock]};
        case REMOVE_USER_STOCK:
            return {...state, userStocks: state.userStocks.filter(stock => stock.id !== action.stockId)};
        default:
            return state;
    }
};

export default portfolioReducer;