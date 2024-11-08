export default function AllStocksList({stocks}) {

    const stocksFormatter = stocks => {
        const finalHTMLItems = []
        for(const key in stocks){
            finalHTMLItems.push((
                <div>
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
        <section>
            <h2>Stocks</h2>
            <div>
                {stocksFormatter(stocks)}
            </div>
        </section>
    )
}