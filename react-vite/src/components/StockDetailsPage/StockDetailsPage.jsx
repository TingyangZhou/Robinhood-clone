// react-vite/src/components/StockDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { getOneStockThunk } from "../../redux/stocks";
import { getUserInfoThunk, updateUserBalanceThunk } from '../../redux/users';
import { getUserStocksThunk, addUserStockThunk, removeUserStockThunk, updateUserStockThunk } from '../../redux/portfolio';
import { useTheme } from '../../context/ThemeContext';
import './StockDetailsPage.css';

const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const stock = useSelector(state => state.stocks.currentStock);
    const user = useSelector(state => state.userInfo.userInfo);
    const userStocks = useSelector(state => state.portfolio.userStocks);

    const { stockId } = useParams();

    const [sharesOrder, setSharesOrder] = useState(0);
    const [sharesOwned, setSharesOwned] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);

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
    }, [dispatch, stockId]);

    useEffect(() => {
        const calculatedShares = userStocks.find(stock => parseInt(stock.stock_id, 10) === parseInt(stockId, 10))?.share_quantity ?? 0;
        setSharesOwned(calculatedShares);
    }, [userStocks, stockId]);


    // Static States
    const marketPrice = stock.updated_price;
    const cashBalance = user?.cash_balance;    

    const sharesPurchasedVal = parseInt(sharesOrder, 10);

    // const averageUserStockValue = userStocks.find(stock => parseInt(stock.stock_id, 10) === parseInt(stockId, 10))?.share_price ?? 0;

    const isBuyButtonDisabled = cashBalance < marketPrice * sharesPurchasedVal || sharesPurchasedVal === 0;
    const isSellButtonDisabled = sharesOrder > sharesOwned || sharesOwned === 0 || sharesPurchasedVal === 0;


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

    const shareHandler = (event) => {
        const shareValue = event.target.value;
        setSharesOrder(shareValue);
        estimatedCostHandler(shareValue);
    };

    const estimatedCostHandler = (shares) => {
        const value1 = marketPrice * shares;
        const value2 = value1.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
        setEstimatedCost(value2);
    };

    const buyButtonHandler = async () => {
        const totalShares = sharesOwned + sharesPurchasedVal;

        // const totalInvestedOwned =  sharesOwned * averageUserStockValue;
        // const totalInvestedPurchased = sharesPurchasedVal * estimatedCost;
        // const totalInvested = totalInvestedOwned + totalInvestedPurchased;
        // const totalPricePerShare = parseFloat((totalInvested / totalShares).toFixed(2));

        // console.log('Test 3:', totalPricePerShare, typeof totalPricePerShare);

        // console.log('Data 1: Owned - (Shares):', sharesOwned);
        // console.log('Data 2: Owned - (Price/Share):', averageUserStockValue);
        // console.log('Data 3: Owned - (Total Invtesed):', totalInvestedOwned);
        // console.log('Data 4: Purchased - (Shares):', sharesPurchasedVal);
        // console.log('Data 5: Purchased - (Price/Share):', marketPrice);
        // console.log('Data 5: Purchased - (Total Invtesed):', estimatedCost);
        // console.log('Data 6: Total - (Shares):', totalShares);
        // console.log('Data 7: Total - (Price/Share):', totalPricePerShare);
        // console.log('Data 8: Total - (Total Invtesed):', totalInvested);
        
        if (cashBalance >= marketPrice * sharesPurchasedVal) {
            alert(`Purchased ${sharesPurchasedVal} shares of ${stock.ticker} for $${estimatedCost}`);

            const updateStock = {
                'num_shares': totalShares
            }            

            console.log('Data 0:', totalShares, stockId, estimatedCost);

            if (sharesOwned === 0) {
                await dispatch(addUserStockThunk(stockId, updateStock));
            }

            if (sharesOwned > 0) {
                await dispatch(updateUserStockThunk(stockId, updateStock));
            }

            const new_balance = parseFloat((- estimatedCost).toFixed(2));
            await dispatch(updateUserBalanceThunk(new_balance));
           
            refreshHandler(totalShares);
        }
    };

    const sellButtonHandler = async () => {        
        if (sharesOwned > 0 && sharesOwned >= sharesPurchasedVal) {
            alert(`Sold ${sharesPurchasedVal} shares of ${stock.ticker} for $${estimatedCost}`);

            const totalShares = sharesOwned - sharesPurchasedVal;

            const updateStock = {
                'num_shares': totalShares
            } 

            console.log('Data 1:', totalShares, stockId, estimatedCost);
            
            if (totalShares === 0) {
                // await dispatch(updateUserStockThunk(stockId, updateStock));
                // console.log('Data 1:', totalShares );
                await dispatch(removeUserStockThunk(parseInt(stockId, 10)));
            }

            if (totalShares > 0) {
                await dispatch(updateUserStockThunk(stockId, updateStock));
            }
            
            const new_balance = parseFloat((parseFloat(estimatedCost)).toFixed(2));
            await dispatch(updateUserBalanceThunk(new_balance));

            refreshHandler(totalShares);
        }
    };

    const buyingPowerHandler = () => {
        return cashBalance?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    }

    // const isBuyButtonDisabled = cashBalance < marketPrice * sharesPurchasedVal || sharesPurchasedVal === 0;
    // const isSellButtonDisabled = sharesOrder > stock.user_shares || sharesOwned === 0 || sharesPurchasedVal === 0;

    

    return (
        <div className='stock-details-page-container'>
            {/* <h1>Stock Details Page</h1> */}

            <div className='left-menu'>                
                <h3>{stock.company_name}</h3>
                <div>${stock.updated_price}</div>
                <div><img src={imgPath}></img></div>
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

                <div>${buyingPowerHandler()} buying power available</div>

                <div>{sharesOwned} Shares Available</div>
                
                <div>+ Add to Watchlist</div>
            </div>

            {/* <div>+ Add to Watchlist</div> */}

        </div>
    );
};

export default StockDetailsPage;