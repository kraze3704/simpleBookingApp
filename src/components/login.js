import React, {Component} from 'react';
import SkyLight from 'react-skylight';

import {
        _Auth,
        _googleLogin
         } from '../firebase/config';
/*
    displays the current user & logout button when logged in,
    and the login button when there is no user.
*/

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    _handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    _login = (e) => {
        e.preventDefault();

        const { email, password } = this.state;

        _Auth.signInWithEmailAndPassword(email, password)
        .catch( (err) => {
                console.log('login failed: ' + err);
                alert('login attempt failed');
                /*
                print error msg in console and alert user when login fails
                */
        });

        this.refs.login_dialog.hide();
    }

    _logout = (e) => {
        e.preventDefault();
        return _Auth.signOut()
                .then((res) => console.log(res))
                .catch(err => console.log('error: ' + err));
    }

    _googleLogin = (e) => {
        e.preventDefault();

        _googleLogin().then(result => {
            let token = result.credential.accessToken;
            console.log(token);
            let user = result.user;
            console.log(user);

            this.props.that.setState({
                _google: true,
            })
        });
    }

    render() {
        const _login_dialog = {
            width: '50%',
            height: '50%',
            marginTop: '-20%',
            marginLeft: '-25%',
        }

        if (!this.props._login){
            /*
                displays the login button the passed _login flag is false
            */
            return(
                <div className='row align-items-center'>
                    <SkyLight dialogStyles={_login_dialog} hideOnOverlayClicked ref="login_dialog">
                        <div className='col'>
                            <p className="text-dark">
                            Login with test account
                            </p>
                        </div>
                        <div className='col'>
                            <input className='col' type='text' name='email' placeholder='Email' onChange={this._handleChange} value={this.state.email} /><br />
                            <input className='col' type='password' name='password' placeholder='Password' onChange={this._handleChange} value={this.state.password} />
                            <br />
                            <button className='col btn btn-dark' onClick={this._login}>Login</button> />
                        </div>
                        <div>
                            <p className="text-secondary">
                            ******************<br/>
                            TEST ACCOUNT<br/>
                            id: test@test.com<br/>
                            pw: 123456<br/>
                            ******************<br/>
                            </p>
                        </div>
                    </SkyLight>

                    <div>
                        <button className="btn btn-dark btn-sm" onClick={() => this.refs.login_dialog.show()}>sign in with test Account</button>
                    </div>

                    <div>
                        <button className="btn btn-dark btn-sm" onClick={this._googleLogin}>sign in with Google</button>
                    </div>
                </div>
            )
        }else return(
            /*
                displays the username / logout button
            */
            <div>
                {/*
                <a>{this.props._user}</a>
                */}
                <button className="btn btn-dark" onClick={this._logout}>Logout</button>
            </div>
        )
    }
}