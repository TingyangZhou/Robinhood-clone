import "./WatchlistStockslist.css"
import { removeFromWatchlistThunk } from "../../redux/watchlist"
import { useDispatch } from 'react-redux'


export default function WatchlistStocksList({ stocks }) {
    const dispatch = useDispatch()

    const stocksFormatter = () => {
        const finalHTMLItems = []
        finalHTMLItems.push((
            <div key="watchlist-header" className="watchlist-item" id="Watchlist-header">
                <h2>Watchlist</h2>
            </div>

        ))
        for(const key in stocks){
            finalHTMLItems.push((
                <div key={key}className="watchlist-item">
                    <div className="watchlist-item-ticker"><p>{stocks[key].ticker}</p></div>
                    <div className="watchlist-item-updated-price"><p>${stocks[key].updated_price}</p></div>
                    <div className="watchlist-item-button"><button onClick={() => {
                        console.log(stocks[key].stock_id)// need to either get stock id from backend or use the watchliststock.id to remove a stock from watchlist 
                        dispatch(removeFromWatchlistThunk(stocks[key].stock_id))}}>-</button></div>
                </div>
            ))
        }
        return finalHTMLItems
    }

    
    return (
        <section className="watchlist-list-container">
            <div className='watchlist-list'>
                {stocksFormatter(stocks)}
                </div>
        </section>
    )
}