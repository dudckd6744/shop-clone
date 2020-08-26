import React from 'react'

function HistoryPage(props) {
    return (
        <div style={{ width:"80%", margin:"3rem auto"}}>
            <div style={{textAlign:"center"}}>
                <h1> History </h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date Of Purchase</th>
                    </tr>
                </thead>
                <tbody>
                    {props.user.userData && props.user.userData.history&&
                    props.user.userData.history.map((item,i)=>(
                        <tr key={i}>
                            <td>{item.id}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dateofPurchase}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
