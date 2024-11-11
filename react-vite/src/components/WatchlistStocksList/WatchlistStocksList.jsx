import "./WatchlistStockslist.css"
export default function WatchlistStocksList({ stocks }) {

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
                    <p>{stocks[key].ticker}</p>
                    <p>{stocks[key].updated_price}</p>
                    <button>-</button>
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