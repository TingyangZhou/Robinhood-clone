import '../PortfolioStocksList/PortfolioStocksList.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfoThunk, updateUserBalanceThunk } from '../../redux/users.js';
import { getUserStocksThunk, removeAllUserStocksThunk } from '../../redux/portfolio.js';
import ConfirmDeleteModal from './DeleteConfirmation.jsx'
import { useModal } from '../../context/Modal';
import PortfolioStocksList from '../PortfolioStocksList';
import { Navigate } from 'react-router-dom';

import { Pie } from 'react-chartjs-2'; 
import 'chart.js/auto'; 

function PortfolioPage(){
    const dispatch = useDispatch()
    const [fund ,setFund] = useState(0)
    // const [errors, setErrors] =useState({})
    const { setModalContent, closeModal } = useModal();
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector((users) =>users.userInfo.userInfo)
    const userStocks = useSelector((portfolio)=>portfolio.portfolio.userStocks)


    useEffect(()=>{
        dispatch(getUserInfoThunk());
        dispatch(getUserStocksThunk())
    },[dispatch])

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserBalanceThunk(fund))
    }

    
    const handleClick = (e) => {
        e.preventDefault();
        
        let totalStockValue = 0
        if (userStocks) {
            for (let userStock of userStocks.values()) {
                totalStockValue += userStock.share_price * userStock.share_quantity
            }
        }
        
        setModalContent(
			<ConfirmDeleteModal
                stockValue={totalStockValue}
				onConfirm={() => {
                    dispatch(removeAllUserStocksThunk()).then(()=>{
                        dispatch(updateUserBalanceThunk(totalStockValue))
                    }).then(()=>{
                        closeModal();
                    })
				}}
				onCancel={closeModal}
			/>
		);

    }

    let market_value=0
    let lengthOfStockList = 0
    if (userStocks) {
        for (let stock of userStocks.values()) {
            market_value += stock.share_quantity * stock.updated_price
        }
        lengthOfStockList = Object.keys(userStocks).length
    }
    
    const total_balance = market_value + userInfo?.cash_balance;
    const formattedMarketValue=market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedCashBalance = userInfo?.cash_balance ? userInfo.cash_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    const formattedTotalBalance =  userInfo?.cash_balance ? total_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

    // preparing for pie chart
    const sortedStocks = userStocks && Object.keys(userStocks).length > 0 ? Object.values(userStocks).sort((a, b) => (b.share_quantity * b.updated_price) - (a.share_quantity * a.updated_price)) : [];
    const pieData = {
        labels: ['Cash Balance', ...userStocks ? Object.values(userStocks).map(stock => stock.ticker) : []],
        datasets: [
            {
                data: [
                    userInfo?.cash_balance || 0,
                    ...userStocks ? Object.values(userStocks).map(stock => stock.share_quantity * stock.updated_price) : []
                ],
                backgroundColor: [
                    '#cecece', 
                    ...sortedStocks.map((stock, index) => `rgba(251, 100, 28, ${(1 - (index / sortedStocks.length) * 0.9).toFixed(2)})`) 
                ],
                borderColor: '#ffffff', 
                borderWidth: 1 
            }
        ]
    };

    const pieOptions = {
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = pieData.datasets[0].data[tooltipItem.dataIndex];
                        const percentage = ((value / total_balance) * 100).toFixed(2);
                        return `${pieData.labels[tooltipItem.dataIndex]}: $${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    
    
    
    return (
        <div className='port-page-container'>
            <div className='top-header'>
                <div className='user-info'>
                    <p className='username'>{userInfo? userInfo.username : null}</p>
                    <p className='user-email'>{userInfo? userInfo.email : null}</p>
                    <ul className='balances'>
                        <li className='balance-item'>
                            <span className='balance-description'>Cash Balance:</span>
                            <span className='balance-amount'>$ {formattedCashBalance}</span>
                        </li>
                        <li className='balance-item'>
                            <span className='balance-description'>Stock Market Value:</span>
                            <span className='balance-amount'>$ {formattedMarketValue}</span>
                        </li>
                        <li className='balance-item'>
                            <span className='balance-description'>Total Balance:</span>
                            <span className='balance-amount'>$ {formattedTotalBalance}</span>
                        </li>
                    </ul>
                </div>
                <div className="pie-chart-container">
                    <h3 id='chart-title'>Portfolio Distribution</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
            <div className="header-container">
                <form className="add-fund-form" onSubmit={handleSubmit}>
                    <input type='number' step="0.01" min="0" placeholder="Enter amount here..." onChange={(e) => setFund(parseFloat(e.target.value))}></input>
                    <button className='add-fund-button'>Add Fund</button>
                </form>
                <button className='liquidate-portfolio-button' onClick={handleClick}>Liquidate Portfolio</button>
            </div>
            <div className="portfolio-stocks-container">
                {lengthOfStockList!==0 && <PortfolioStocksList stocks={sortedStocks} pageSize={8} heightPx={675}/>}
            </div>
        </div> 
    )
}

export default PortfolioPage