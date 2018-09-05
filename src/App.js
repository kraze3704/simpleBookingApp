import React, { Component } from 'react';
import './App.css';

import Login from './components/login';
import Orderlist from './components/orderlist';

import { _Auth } from './firebase/config';

  /*
      uses firebase for authentication

      login.js manages login and logout function
      orderlist.js manages listing the orders for the customer

  */

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      _isAuth: false,
    }
    /* 
      user contains the id of the user, null if not logged in
      _isAuth is either true or false depending on the login status
    */
  }

  componentDidMount() {
    _Auth.onAuthStateChanged((user) =>
    {if (user /* && user.emailVerified */)
      {
        this.setState({ user: user.email, _isAuth: true, });
      }
      else
      {
        this.setState({ user: null, _isAuth: false, });
        // some notice to alert the user that the login attempt failed? <<
        // => added alert in login.js
      }
    });
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">MyLaundry</h1>
          <div>
            <Login _login={this.state._isAuth} _user={this.state.user}/>
          </div>
        </header>

        <div className="App-content">
          <Orderlist _user={this.state.user}/>
          {/* passes user's id (email) to Orderlist */}
        </div>

      </div>
    );
  }
}