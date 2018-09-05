import React, { Component } from 'react';

import { db } from '../firebase/config';
import Addorder from './addorder';

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
        if(this.props._google === false){
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
                <a href={googleCalendarUrl} target='_blank'><button className='btn btn-outline-info btn-sm'> add to G</button></a>
            )

            /*
            temporary solution to call google calendar add event to access client's google calendar
            */
        }
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
                else if(a.pickup_date  < b.pickup_date){
                    return -1;
                }
                else if(a.pickup_date === b.pickup_date){
                    if(a.delivery_date > b.delivery_date){
                        return 1;
                    }
                    else if(a.delivery_date < b.delivery_date){
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
            accept order object and push to firestore database
            customerid fetched from props
        */
    }

    _deleteOrder = (docId, index) => {
        db.collection('orders').doc(docId).delete();
        /*
            accept document id as input, then delete the corresponding document
            from firestore database
        */
        alert('Removed Booking #' + index + '!');
        this._loadOrderlist();
        /*
            alert client and refresh list
        */
    }

    render(){
        const orderlist = this.state.orderlist.map((order, index) =>
        <tr key={index}>
            <th scope='row'>{index + 1}</th>
            <td>
                <a>PICKUP: {order.pickup_date}  </a>
                {this._googleCalendar(order.pickup_date, this.props._user, 'PICKUP')}
            </td>
            <td>
                <a>{(order.delivery_date) ? 'DELIVERY: ' + order.delivery_date + '  ' : 'ORDER DELIVERY'}</a>
                {this._googleCalendar(order.delivery_date, this.props._user, 'DELIVERY')}
            </td>
            <td><button className='btn btn-outline-danger btn-block' onClick={() => this._deleteOrder(order.id, index+1)}>Delete order</button></td>
        </tr>
        );

        if(this.props._user == null){
            return(
            <div>
                <p>
                WELCOME! PLEASE LOG IN TO YOUR ACCOUNT TO VIEW YOUR BOOKINGS!
                </p>
           </div>
        )
    }else if(orderlist === ''){
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
            <table className='table table-hover'>
                <thead className='thead-light'>
                    <tr>
                        <th scope='col'>order#</th>
                        <th scope='col'>PICKUP_date</th>
                        <th scope='col'>DELIVERY_date</th>
                        <th scope='col'></th>
                    </tr>
                </thead>
                <tbody>
                    {orderlist}
                </tbody>
            </table>
        </div>
    )
    }
}