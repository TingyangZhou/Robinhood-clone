import './AllStocksList.css'
export default function AllStocksList({stocks}) {

    const stocksFormatter = stocks => {
        const finalHTMLItems = []
        for(const key in stocks){
            finalHTMLItems.push((
                <div className="stock-list-item">
                    <p>{stocks[key].company_name}</p>
                    <p>{stocks[key].ticker}</p>
                    <p>{stocks[key].updated_price}</p>
                    <button>+</button>
                </div>
            ))
        }
        return finalHTMLItems
    }
    return (
        <section className="stocks-all-list-container">
            <h2>Stocks</h2>
            <div className='stocks-all-list'>
                {stocksFormatter(stocks)}
            </div>
        </section>
    )
}