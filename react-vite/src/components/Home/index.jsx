import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getAllStocksThunk } from '../../redux/stocks';
import { useEffect } from 'react';

// import { getAllWatchlistThunk } from '../../redux/watchlist';

export default function Home() {
    // const data = useLoaderData();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllStocksThunk())
    }, [dispatch])

    // useEffect(()=>{
    //     dispatch( getAllWatchlistThunk())
    // }, [dispatch])


    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }

    return (
        <>
            <h1>Welcome to Robinhood!</h1>
        </>
    );
}
