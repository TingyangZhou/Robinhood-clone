import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getAllStocksThunk } from '../../redux/stocks';
import { useEffect } from 'react';
import AllStocksList from '../AllStocksList';
import WatchlistStocksList from '../WatchlistStocksList';
import "./indexHome.css"

// import { getAllWatchlistThunk } from '../../redux/watchlist';

export default function Home() {
    // const data = useLoaderData();
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const allStocks = useSelector((state) => state.stocks.stocks);

    useEffect(() => {
        dispatch(getAllStocksThunk())
    }, [dispatch])

    // useEffect(()=>{
    //     dispatch( getAllWatchlistThunk())
    // }, [dispatch])


    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }

    return (
        <main>
            <AllStocksList stocks={allStocks}/>
            <WatchlistStocksList/>
        </main>
    );
}
