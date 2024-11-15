// react-vite/src/components/StockDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getOneStockThunk } from "../../redux/stocks";
import { getUserInfoThunk, updateUserBalanceThunk } from '../../redux/users';
import { getUserStocksThunk, addUserStockThunk, removeUserStockThunk, updateUserStockThunk } from '../../redux/portfolio';
import { getAllWatchlistThunk, addToWatchlistThunk, removeFromWatchlistThunk } from '../../redux/watchlist';
import { useTheme } from '../../context/ThemeContext';
import StockGraph from "../StockGraph"
import './StockDetailsPage.css';


const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const stock = useSelector(state => state.stocks.currentStock);
    const user = useSelector(state => state.userInfo.userInfo);
    const userStocks = useSelector(state => state.portfolio.userStocks);
    const watchlist = useSelector(state => state.watchlist);
    const sessionUser = useSelector((state) => state.session.user);

    const { stockId } = useParams();

    const [sharesOrder, setSharesOrder] = useState(0);
    const [sharesOwned, setSharesOwned] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true);
    const [isSellButtonDisabled, setIsSellButtonDisabled] = useState(true);

    //!!! Stock chart code 1 starts here
    const { isDarkMode } = useTheme();
    const [imgPath, setImgPath] = useState('/images/dark-mode-graph.png');

    useEffect(() => {
        const path = isDarkMode ? '/images/dark-mode-graph.png' : '/images/light-mode-graph.png';
        setImgPath(path);
    }, [isDarkMode]);
    

    // Dynamic States
    useEffect(() => {
        dispatch(getOneStockThunk(stockId));
        dispatch(getUserInfoThunk());
        dispatch(getUserStocksThunk());
        dispatch(getAllWatchlistThunk());
    }, [dispatch, stockId]);

    useEffect(() => {
        const calculatedShares = userStocks?.find(stock => parseInt(stock.stock_id, 10) === parseInt(stockId, 10))?.share_quantity ?? 0;
        setSharesOwned(calculatedShares);
    }, [userStocks, stockId]);

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }

    // Static States
    const marketPrice = stock.updated_price;
    const cashBalance = user?.cash_balance;

    const sharesOrderFomrat = parseInt(sharesOrder, 10);
    const averageUserStockValue = userStocks?.find(stock => parseInt(stock.stock_id, 10) === parseInt(stockId, 10))?.share_price ?? 0;

    const getWatchlistId = () => {
        for (let key in watchlist)  {
            let currKey = watchlist[key];
            if (currKey.stock_id === stock.id) {
                return currKey.id;
            }
        }
    };

    // const isBuyButtonDisabled = cashBalance < marketPrice * sharesOrderFomrat || sharesOrderFomrat === 0 || sharesOrder === '';
    // const isSellButtonDisabled = sharesOrder > sharesOwned || sharesOwned === 0 || sharesOrderFomrat === 0 || sharesOrder === '';

    useEffect(() => {
        const buyDisabled = cashBalance < marketPrice * sharesOrderFomrat || sharesOrderFomrat === 0 || sharesOrder === '';
        const sellDisabled = sharesOrder > sharesOwned || sharesOwned === 0 || sharesOrderFomrat === 0 || sharesOrder === '';
        
        setIsBuyButtonDisabled(buyDisabled);
        setIsSellButtonDisabled(sellDisabled);
    }, [cashBalance, marketPrice, sharesOrder, sharesOrderFomrat, sharesOwned]);


    // Loading States
    if (!stock) {
        return <div>Loading...</div>
    }

    // Handlers
    const refreshHandler = (shares) => {
        setSharesOrder(0);
        setEstimatedCost(0);
        setSharesOwned(shares);
    };

    const formatHandler = (value) => {
        return value?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    }

    const shareHandler = (event) => {
        // if (event)
        const shareValue = event.target.value;
        console.log('Data 1', shareValue, typeof shareValue);

        if (shareValue !== '') {
            if (parseInt(shareValue) < 0 || isNaN(parseInt(shareValue)) || shareValue.includes('.')) {
                alert('Value has to be a positive integer');
                event.target.value = 0
                return
            }
        } 
        

        setSharesOrder(shareValue);
        estimatedCostHandler(shareValue);
    };

    const estimatedCostHandler = (shares) => {
        setEstimatedCost(marketPrice * shares);
    };

    const buyButtonHandler = async () => {        
        if (cashBalance >= marketPrice * sharesOrderFomrat) {
            setIsBuyButtonDisabled(true);
            setIsSellButtonDisabled(true);

            const totalShares = sharesOwned + sharesOrderFomrat;
            const totalPricePerShare = parseFloat((((sharesOwned * averageUserStockValue) + (estimatedCost)) / (sharesOwned + sharesOrderFomrat)).toFixed(2));

            const updateStock = {
                'num_shares': totalShares,
                'updated_price': totalPricePerShare
            }            

            if (sharesOwned === 0) {
                await dispatch(addUserStockThunk(stockId, updateStock));
            }

            if (sharesOwned > 0) {
                await dispatch(updateUserStockThunk(stockId, updateStock));
            }

            const new_balance = parseFloat(( -estimatedCost).toFixed(2));
            dispatch(updateUserBalanceThunk(new_balance));
           
            refreshHandler(totalShares);

            alert(`Purchased ${sharesOrderFomrat} shares of ${stock.ticker} for $${formatHandler(estimatedCost)}`);
        }
    };

    const sellButtonHandler = async () => {        
        if (sharesOwned > 0 && sharesOwned >= sharesOrderFomrat) {
            setIsBuyButtonDisabled(true);
            setIsSellButtonDisabled(true);

            const totalShares = sharesOwned - sharesOrderFomrat;
            const totalPricePerShare = parseFloat((((sharesOwned * averageUserStockValue) + (estimatedCost)) / (sharesOwned + sharesOrderFomrat)).toFixed(2));

            const updateStock = {
                'num_shares': totalShares,
                'updated_price': totalPricePerShare
            } 
            
            if (totalShares === 0) {
                await dispatch(removeUserStockThunk(parseInt(stockId, 10)));
            }

            if (totalShares > 0) {
                await dispatch(updateUserStockThunk(stockId, updateStock));
            }
            
            const new_balance = parseFloat((parseFloat(estimatedCost)).toFixed(2));
            dispatch(updateUserBalanceThunk(new_balance));

            refreshHandler(totalShares);

            alert(`Sold ${sharesOrderFomrat} shares of ${stock.ticker} for $${formatHandler(estimatedCost)}`);
        }
    };

    const addWatchlistHandler = async () => {
        await dispatch(addToWatchlistThunk(stockId));
    };

    const removeWatchlistHandler = async () => {
        await dispatch(removeFromWatchlistThunk(getWatchlistId()));
    };

    return (
        <div className='stock-details-page-container'>

            <div className='left-menu'>                
                <h3>{stock.company_name}</h3>
                <div>${stock.updated_price}</div>
                {/* <div><img src={imgPath}></img></div> */}
                <StockGraph />
                <h3>About</h3>
                <div>{stock.company_info}</div>
            </div>

            <div className='right-menu'>
                <div>Buy/Sell {stock.ticker}</div>

                <div className='order-menu'>
                    <div>Shares</div>
                    <input
                        type="number"
                        value={sharesOrder}
                        step='1'
                        onChange={shareHandler}
                        min="0"
                    />
                </div>

                <div className='order-menu'>
                    <div>Market Price</div>
                    <div>${stock.updated_price}</div>
                </div>

                <div className='order-menu'>
                    <div>Estimated Cost/Credit</div>
                    <div>${formatHandler(estimatedCost)}
                    </div>
                </div>
                
                <div>
                    <button
                        onClick={buyButtonHandler}
                        disabled={isBuyButtonDisabled}
                    >
                        Buy
                    </button>
                </div>

                <div>
                    <button
                        onClick={sellButtonHandler}
                        disabled={isSellButtonDisabled}
                    >
                        Sell
                    </button>
                </div>

                <div>${formatHandler(cashBalance)} buying power available</div>

                <div>{sharesOwned} Shares Available</div>
                
                <div>
                    {getWatchlistId() ? (
                        <button
                            onClick={removeWatchlistHandler}
                        >
                            - Remove from Watchlist
                        </button>
                    ) : (
                        <button
                            onClick={addWatchlistHandler}
                        >
                            + Add to Watchlist
                        </button>
                    )}
                </div>
                
            </div>

        </div>
    );
};

export default StockDetailsPage;