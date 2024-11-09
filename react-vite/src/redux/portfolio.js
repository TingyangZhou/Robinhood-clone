// app/api/portfolio.js

const GET_PORTFOLIO = 'portfolio/getAll';
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

// Thunk Action
export const getAllPortfolioThunk = () => async (dispatch) => {
    const response = await fetch('/api/portfolio', {
        method: 'GET'
    });
    const data = await response.json();
    dispatch(getPortfolioAction(data.portfolio));
    return response;
};

// Reducer
const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PORTFOLIO:
            return {...state, portfolio: action.portfolio};
        default:
            return state; 
    }
};

export default portfolioReducer;