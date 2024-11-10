// app/api/portfolio.js

const GET_PORTFOLIO = 'portfolio/getPortfolio';
const CREATE_PORTFOLIO = 'portfolio/createPortfolio';
const initialState = {
    portfolio: {}
};

// Action Creators
export const getPortfolioAction = (portfolio) => {
    return {
        type: GET_PORTFOLIO,
        portfolio
    };
};

export const createPortfolioAction = (portfolio) => {
    return {
        type: CREATE_PORTFOLIO,
        portfolio
    };
};

// Thunk Actions
export const getAllPortfolioThunk = () => async (dispatch) => {
    const response = await fetch('/api/portfolio', {
        method: 'GET'
    });
    const data = await response.json();
    dispatch(getPortfolioAction(data.portfolio));
    return response;
};

export const createPortfolioStockThunk = (portfolioData) => async (dispatch) => {
    const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData)
    });
    const data = await response.json();
    dispatch(createPortfolioAction(data));
    return data;
};

// Reducer
const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PORTFOLIO:
            return {...state, portfolio: action.portfolio};
        case CREATE_PORTFOLIO:
            return {...state, portfolio: action.portfolio};
        default:
            return state; 
    }
};

export default portfolioReducer;