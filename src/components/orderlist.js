import React, { Component } from 'react';

import { db } from '../firebase/config';
import Addorder from './addorder'

import './orderlist.css';
    /*
        fetches the order list data for the user
        only when authentication is done.

        + google calendar to add later?
    */

export default class Orderlist extends Component{
    state = {
        orderlist: [],
    };

    componentDidMount() {
        this._loadOrderlist();
    }

    _loadOrderlist = () => {
        /*
            fetch orders for the customer and save to state
        */
       let orderlist = [];

        db.collection('orders').get().then(
            (QuerySnapshot) => {
                QuerySnapshot.forEach((doc) => {
                    let orderitem = {
                        pickup_date: doc.data().pickup_date,
                        delivery_date: doc.data().delivery_date,
                    };
                    orderlist.push(orderitem);
                })
            }
        ).then((e)=>
            this.setState({
                orderlist: orderlist,
            })
        );
        /* force function to wait for whole array to be loaded, then setState */
    }

    _addOrder = (newOrder) => {
        db.collection('orders').add({
            customerid: this.props._user,
            pickup_date: newOrder.pickup_date,
            delivery_date: newOrder.delivery_date,
        });
    }

    render(){
        const orderlist = this.state.orderlist.map((order, index) =>
        <tr key={index}>
            <td>{index}</td>
            <td>PICKUP: {order.pickup_date}</td>
            <td>{(order.delivery_date) ? 'DELIVERY DATE: ' + order.delivery_date : 'ORDER DELIVERY'}</td>
        </tr>
        );

        if(this.props._user == null){
            return(
            <div>
                WELCOME! PLEASE LOG IN TO YOUR ACCOUNT TO VIEW YOUR BOOKINGS!
           </div>
        )
    }else return(
        <div className='App'>
            <Addorder _addOrder={this._addOrder} _reload={this._loadOrderlist} />
            Logged in as: {this.props._user}
            <table>
                <tbody>
                {orderlist}
                </tbody>
            </table>
            <button onClick={this._loadOrderlist}>Refresh list</button>
        </div>
    )
    }
}