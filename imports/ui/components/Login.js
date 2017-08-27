import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {login} from '/imports/modules/account';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import WalletList from "./subcomponents/WalletList";

const logo = '/images/neon-logo2.png';

const onWifChange = (dispatch, value) => {
  // TODO: changed back to only WIF login for now, getting weird errors with private key hex login
  dispatch(login(value));
};

const styles = {
  buttonLabelStyle: {
    "fontSize": "2em",
    "padding": "10px"
  },
  buttonStyle: {
    "padding": "10px"
  }
};

let Login = ({dispatch, loggedIn, wif}) =>
  <div id="loginPage">
    <div className="login">
      <div className="logo"><img src={logo}/></div>
      <WalletList/>
      <Link to="/import"><RaisedButton
        label="Import existing Wallet"
        fullWidth={true}
        primary={true}
      /></Link>
      <Link to="/create"><RaisedButton
        label="New Wallet"
        fullWidth={true}
        secondary={true}
      /></Link>
    </div>
  </div>;

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn,
  wif: state.account.wif,
  wallet: state.account.wallet
});

Login = connect(mapStateToProps)(Login);

export default Login;
