import { useState, useEffect } from 'react'
import './AllStocksList.css'
import { addToWatchlistThunk } from '../../redux/watchlist'
import { useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'


export default function AllStocksList({stocks, pageSize, heightPx}) {
    const [currPage, setCurrPage] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const redirectToStockPage = stockId => {
        navigate(`/stocks/${stockId}`)
    }


   
    const stocksFormatter = stocks => {
        const startingPoint = (currPage - 1) * pageSize
        const finalHTMLItems = [(<div key="home-column-identifier" className="stock-list-item-home">
            <div className="company-name-list-item-home"><p>Company Name</p></div>
                    <div className="ticker-list-item-home"><p>Symbol</p></div>
                    <div className="updated-price-list-item-home"><p>Market Price</p></div>
                    <div className="button-list-item-home">Add to watchlist</div>
        </div>)]
        const arrStocks = Object.values(stocks)
        for(let i = startingPoint; i < startingPoint + pageSize && i < Object.keys(stocks).length ; i++){
            finalHTMLItems.push((
                <div onClick={() => redirectToStockPage(arrStocks[i].id)}key={i} className="stock-list-item-home">
                    <div className="company-name-list-item-home"><p>{arrStocks[i].company_name.length > 24 ? arrStocks[i].company_name.substring(0, 23) + "...": arrStocks[i].company_name}</p></div>
                    <div className="ticker-list-item-home"><p>{arrStocks[i].ticker}</p></div>
                    <div className="updated-price-list-item-home"><p>${arrStocks[i].updated_price}</p></div>
                    <div className="button-list-item-home"><button  className="add-to-watchlist-home-button"onClick={(e) => {
                        e.stopPropagation()
                        dispatch(addToWatchlistThunk(arrStocks[i].id))
                        }}>{arrStocks[i].is_in_watchlist ? "-" : "+"}</button></div>
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


    if(Object.keys(stocks).length == 0){
        return (
        <section className="stocks-all-list-container-home">
            <h2>Stocks</h2>
            <div className='stocks-all-list-home'style={{ height: `${heightPx}px`}}>
                <h2 className="none-found-text-home">No matches found...</h2>
            </div>
        </section>)
    }
    
    return (
        <section className="stocks-all-list-container-home">
            <h2>Explore Stocks</h2>
            <div className='stocks-all-list-home'style={{ height: `${heightPx}px`}}>
                {stocksFormatter(stocks)}
                </div>
            <footer className="pagination-footer-home"><p>Page {currPage}</p><div className="pagination-footer-items-container-home">{paginationFooterFormatter(stocks)}</div></footer>
        </section>
    )
}


// if from portfolio page, the price column name is share_price; for landing page, the column name is update_price
// const priceName = pageName=='portfolioPage'? 'share_price':'updated_price';
// const stockListButtonClassName = pageName=='portfolioPage'? "stock-list-button-hidden" :"stock-list-button";
// const stockIdName=pageName=='portfolioPage'? "stock_id" :"id";

