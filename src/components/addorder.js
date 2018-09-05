import React, { Component } from 'react';
import Skylight from 'react-skylight';

export default class AddOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            pickup_date: '',
            delivery_date: '',
        }
    }

    _handleChange = (e) => {
        this.setState({
            [e.target.name] : [e.target.value],
        })
    }

    _submit = (e) => {
        e.preventDefault();

        let newOrder = {
            pickup_date: this.state.pickup_date,
            delivery_date: this.state.delivery_date,
        }

        this.props._addOrder(newOrder);
        this.props._reload();
        this.refs.order_dialog.hide();
    }

    render() {
        const _orderDialogue = {
            width: '70%',
            height: '70%',
            marginTop: '10%',
            marginleft: '10%',
        }

        return(
            <div>
                <Skylight dialogueStyles={_orderDialogue} hideOnOverlayClicked ref="order_dialog">
                <p>pickup date: </p>
                <input type='date' name='pickup_date' placeholder='YYYY-MM-DD' onChange={this._handleChange} value={this.state.pickup_date} />
                <p>delivery date: </p>
                <input type='date' name='delivery_date' placeholder='YYYY-MM-DD' onChange={this._handleChange} value={this.state.delivery_date} />
                <br />
                <button onClick={this._submit}>Submit</button>
                </Skylight>

                <button className='btn btn-outline-info' onClick={()=> this.refs.order_dialog.show()}> Order new laundry </button>
                <a href='https://calendar.google.com' target='_blank' rel='noopener noreferrer'><button className='btn btn-outline-info'>Google Calendar</button></a>
            </div>
        )
    }
}