// react-vite/src/components/StockDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { getOneStockThunk } from "../../redux/stocks";
import { getUserInfoThunk } from '../../redux/users';
import { getUserStocksThunk } from '../../redux/portfolio';
import './StockDetailsPage.css';

const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const stock = useSelector(state => state.stocks.currentStock);
    const user = useSelector(state => state.userInfo.userInfo);
    // const userStocks = useSelector(state => state.userStocks.userStocks);
    const { stockId } = useParams();

    const [shares, setShares] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        dispatch(getOneStockThunk(stockId));
        dispatch(getUserInfoThunk());
        dispatch(getUserStocksThunk());

        // if (user) {
        //     setBalance(user.cash_balance);
        // }
    }, [dispatch, stockId]);

    useEffect(() => {
        if (user) {
            setBalance(user.cash_balance);
        }
    }, [user]);

    if (!stock) {
        return <div>Loading...</div>
    }

    // Handlers
    const currenPrice = stock.updated_price;
    // setBalance(user.cash_balance);

    const shareHandler = (event) => {
        const shareValue = event.target.value;
        setShares(shareValue);
        estimatedCostHandler(shareValue);
    };

    const estimatedCostHandler = (shares) => {
        const cost = currenPrice * shares;
        const formattedCost = cost.toFixed(2);
        // const formatNumber = Number(formattedCost);
        // const formatString = formatNumber.toLocaleString()
        setEstimatedCost(formattedCost);
    };

    const buyButtonHandler = () => {
        if (balance >= currenPrice * shares) {
            alert(`Purchased ${shares} shares of ${stock.ticker} for $${estimatedCost}`);
            // NOTE: Possibly add stock to watchlist if not already there
            setBalance(balance - (currenPrice * shares));
            // NOTE: Should I redirect to Stock Details Page (refresh) or to the Portfolio Page
        }
    };

    const sellButtonHandler = () => {

    };

    const isDisabled = balance < currenPrice * shares || shares == 0; // NOTE: Keep button dimmed out in .css

    return (
        <div className='stock-details-page-container'>
            {/* <h1>Stock Details Page</h1> */}

            <div className='left-menu'>                
                <h3>{stock.company_name}</h3>
                <div>${stock.updated_price}</div>
                <div>Image url here:{stock.image_url}</div>
                <h3>About</h3>
                <div>{stock.company_info}</div>
            </div>

            <div className='right-menu'>
                <div>Buy/Sell {stock.ticker}</div>

                <div className='order-menu'>
                    <div>Shares</div>
                    <input
                        type="number"
                        value={shares}
                        step='1'
                        onChange={shareHandler}
                    />
                </div>

                <div className='order-menu'>
                    <div>Market Price</div>
                    <div>${stock.updated_price}</div>
                </div>

                <div className='order-menu'>
                    <div>Estimated Cost/Credit</div>
                    <div>${estimatedCost}</div>
                </div>
                
                <div>
                    <button
                        onClick={buyButtonHandler}
                        disabled={isDisabled}
                    >
                        Buy
                    </button>
                </div>
                <div><button>Sell</button></div>

                {/* <div>${user.cash_balance} buying power available</div> */}
                <div>${balance} buying power available</div>

                <div>Shares Available</div>
                
                <div>+ Add to Watchlist</div>
            </div>

            {/* <div>+ Add to Watchlist</div> */}

        </div>
    );
};

export default StockDetailsPage;