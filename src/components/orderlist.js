import React, { Component } from 'react';

import { db } from '../firebase/config';
import Addorder from './addorder';

import './orderlist.css';

    /*
        fetches the order list data for the user
        only when authentication is done.
    */

export default class Orderlist extends Component{
    state = {
        orderlist: [],
    };

    componentDidMount() {
        this._loadOrderlist();
    }

    _googleCalendar = (date, userId, description) => {
        let dateObject = new Date(date);

        let startDate = dateObject.getFullYear()
                        + ((dateObject.getMonth() + 1 > 9) ? dateObject.getMonth() + 1 : '0' + (dateObject.getMonth() + 1) )
                        + ((dateObject.getDate() > 9) ? dateObject.getDate() : '0' + dateObject.getDate() );
        let endDate = dateObject.getFullYear()
                        + ((dateObject.getMonth() + 1 > 9) ? dateObject.getMonth() + 1 : '0' + (dateObject.getMonth() + 1) )
                        + ((dateObject.getDate() + 1 > 9) ? dateObject.getDate() + 1 : '0' + (dateObject.getDate() + 1) );

        let googleCalendarUrl = 'https://calendar.google.com/calendar/r/eventedit?dates='
        + startDate + '/' + endDate + '&text=' + userId + '&details=' + description;

        return(
            <a href={googleCalendarUrl} target='_blank'><button> add to G</button></a>
        )

        /*
        temporary solution to call google calendar add event to access client's google calendar
        */
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
                        id: doc.id,
                        pickup_date: doc.data().pickup_date,
                        delivery_date: doc.data().delivery_date,
                    };
                    orderlist.push(orderitem);
                })
            }
        ).then((e)=> {
            let sortedList = orderlist.sort(function(a, b){
                if(a.pickup_date > b.pickup_date){
                    return 1;
                }
                if(a.pickup_date  < b.pickup_date){
                    return -1;
                }
                if(a.pickup_date == b.pickup_date){
                    if(a.delivery_date > b.delivery_date){
                        return 1;
                    }
                    if(a.delivery_date < b.delivery_date){
                        return -1;
                    }
                }
                else{
                    return 0;
                }
            });
            /*
            sort the retrieved list by pickup_date, delivery_date in ascending order
            */

            this.setState({
                orderlist: sortedList,
            });
        }
        );
        /* force function to wait for whole array to be loaded with .then(), setState after */
    }

    _addOrder = (newOrder) => {
        db.collection('orders').add({
            customerid: this.props._user,
            pickup_date: newOrder.pickup_date,
            delivery_date: newOrder.delivery_date,
        });

        /*
        let calendarPickup = {
            description: 'pickup example',

            end: {
                date: this.props.pickup_date,
            },
            start: {
                date: this.props.pickup_date,
            }
        };
        */
    }

    _deleteOrder = (docId, index) => {
        db.collection('orders').doc(docId).delete();
        alert('Removed Booking #' + index + '!');
        this._loadOrderlist();
    }

    render(){
        const orderlist = this.state.orderlist.map((order, index) =>
        <tr key={index}>
            <td>{index + 1}</td>
            <td>PICKUP: {order.pickup_date}</td>
            <td>{(order.delivery_date) ? 'DELIVERY: ' + order.delivery_date : 'ORDER DELIVERY'}</td>
            <td><button onClick={() => this._deleteOrder(order.id, index+1)}>Delete order</button></td>
            <td>{this._googleCalendar(order.delivery_date, this.props._user, 'DELIVERY')}</td>
        </tr>
        );

        if(this.props._user == null){
            return(
            <div>
                WELCOME! PLEASE LOG IN TO YOUR ACCOUNT TO VIEW YOUR BOOKINGS!
           </div>
        )
    }else if(orderlist == ''){
        return(
            <div>
                <p>Logged in as: {this.props._user}</p>
                <Addorder _addOrder={this._addOrder} _reload={this._loadOrderlist} />
                <p>THERE ARE NO BOOKINGS FOR YOU!</p>
            </div>
        )
    }
    else return(
        <div className='App'>
            <p>Logged in as: {this.props._user}</p>
            <Addorder _addOrder={this._addOrder} _reload={this._loadOrderlist} />
            <table>
                <tbody>
                {orderlist}
                </tbody>
            </table>

            <form action='https://calendar.google.com/' target='_blank'>
                <input type='submit' value='calendar'/>
            </form>

        </div>
    )
    }
}