import React, {Component} from 'react';
import SkyLight from 'react-skylight';
import { _Auth } from '../firebase/config';

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
        .catch( () => {
                alert('login attempt failed');
        });

        this.refs.login_dialog.hide();
    }

    _logout = (e) => {
        e.preventDefault();
        return _Auth.signOut();
    }

    render() {
        const _login_dialog = {
            width: '300px',
            height: '500px',
            marginTop: '-20%',
            marginLeft: '-35%',
        }

        if (!this.props._login){
            /*
                displays the login button the passed _login flag is false
            */
            return(
                <div>
                    <SkyLight dialogStyles={_login_dialog} hideOnOverlayClicked ref="login_dialog">
                        <input type='text' name='email' placeholder='Email' onChange={this._handleChange} value={this.state.email} />
                        <input type='password' name='password' placeholder='Password' onChange={this._handleChange} value={this.state.password} />
                        <br />
                        <button onClick={this._login}>Login</button> />
                    </SkyLight>

                    <div>
                        <button onClick={() => this.refs.login_dialog.show()}>Login</button>
                    </div>
                </div>
            )
        }else return(
            /*
                displays the username / logout button
            */
            <div>
                <p>{this.props._user}</p>
                <button onClick={this._logout}>Logout</button>
            </div>
        )
    }
}