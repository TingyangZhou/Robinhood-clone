import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function Home() {
    // const data = useLoaderData();

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
