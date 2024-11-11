// react-vite/src/components/StockDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOneStockThunk } from "../../redux/stocks";
import { useParams } from 'react-router-dom'

const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const stock = useSelector(state => state.stocks.currentStock);
    const { stockId } = useParams();

    useEffect(() => {
        dispatch(getOneStockThunk(stockId));
    }, [dispatch, stockId]);

    if (!stock) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Stock Details Page</h1>

            <div className='left-menu'>                
                <h3>{stock.company_name}</h3>
                <div>${stock.updated_price}</div>
                <div>Image url here:{stock.image_url}</div>
                <h3>About</h3>
                <div>{stock.company_info}</div>
            </div>

            <div className='right-menu'>
                <div>Buy {stock.ticker}</div>
                <div>Shares: 0</div>
                <div>Market Price: $0.00</div>
                <div>Estimated Cost: $0.00</div>
                <div><button>BUY</button></div>
                <div><button>SELL</button></div>
                <div>Add to Watchlist</div>
            </div>


            {/* <div>Spot Id: {stockId}</div>
            <div>Stock Info: {JSON.stringify(stock)}</div> */}
        </div>
    );
};

export default StockDetailsPage;