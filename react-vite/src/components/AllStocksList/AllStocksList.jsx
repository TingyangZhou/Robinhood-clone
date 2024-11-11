import { useState, useEffect } from 'react'
import './AllStocksList.css'
export default function AllStocksList({stocks, pageSize, heightPx}) {
    const [currPage, setCurrPage] = useState(1)

    
    const stocksFormatter = stocks => {
        const startingPoint = (currPage - 1) * pageSize
        const finalHTMLItems = []
        const arrStocks = Object.values(stocks)
        for(let i = startingPoint; i < startingPoint + pageSize && i < Object.keys(stocks).length ; i++){
            finalHTMLItems.push((
                <div key={i}className="stock-list-item">
                    <div className="company-name-list-item"><p>{arrStocks[i].company_name.length > 24 ? arrStocks[i].company_name.substring(0, 23) + "...": arrStocks[i].company_name}</p></div>
                    <div className="ticker-list-item"><p>{arrStocks[i].ticker}</p></div>
                    <div className="updated-price-list-item"><p>${arrStocks[i].updated_price}</p></div>
                    <div className="button-list-item"><button>{arrStocks[i].is_in_watchlist ? "-" : "+"}</button></div>
                </div>
            ))

        }
        return finalHTMLItems
    }

    const paginationFooterFormatter = stocks => {
        const finalHTMLItems = []
        const numStocks = Object.keys(stocks).length
        const numPages = Math.ceil(numStocks / pageSize)
        for(let i = 1; i <= numPages; i++){
            finalHTMLItems.push((
                <p onClick={() => setCurrPage(i)}key={i}className={currPage == i ? "current-page-link": ""}>{i}</p>
            ))
        }
        return finalHTMLItems


    }
    if(!Object.keys(stocks).length){
        return (<h2>Loading....</h2>)
    }
    return (
        <section className="stocks-all-list-container">
            <h2>Stocks</h2>
            <div className='stocks-all-list'style={{ height: `${heightPx}px`}}>
                {stocksFormatter(stocks)}
                </div>
            <footer className="pagination-footer"><p>Page {currPage}</p><div className="pagination-footer-items-container">{paginationFooterFormatter(stocks)}</div></footer>
        </section>
    )
}