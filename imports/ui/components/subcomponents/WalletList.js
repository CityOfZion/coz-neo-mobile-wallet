import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { login } from '/imports/modules/account';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import { connect } from 'react-redux';
import * as api from 'neon-js';
import {hashHistory} from 'react-router';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const paperStyle = {
  marginTop: '3vh',
  marginBottom: '3vh',
  paddingTop: 0
};

const listItemStyle = {
  textAlign: 'left'
};

const refreshStyle = {
  display: 'inline-block',
  position: 'relative'
};

class WalletList extends Component {
  
  constructor() {
    super();
    this.state = {
      disableLoginButton: true,
      open: false,
      passphrase: '',
      wallet: {},
      loggingIn: false
    }
  }
  
  handleWalletClick = wallet => {
    console.log('wallet', wallet);
    this.setState({open: true, wallet: wallet});
  };
  
  handleLogin = () => {
    this.setState({loggingIn: true});
    Meteor.setTimeout(() => {
      api.decrypt_wif(this.state.wallet.encrypted, this.state.passphrase).then((result) => {
        this.props.dispatch(login(result, this.state.wallet));
        hashHistory.push('/dashboard');
      });
    }, 500);
  };
  
  handleClose = () => {
    this.setState({open: false});
  };
  
  loadingIndicator() {
    return (<div>
      <p><strong>Logging in, please wait...</strong></p>
      <RefreshIndicator
        size={80}
        left={0}
        top={0}
        status="loading"
        style={refreshStyle}
        />
    </div>)
  }
  
  login() {
    return (
      <div>
        <div>To unlock your wallet [{this.state.wallet.name}], you will need to enter your passphrase</div>
        <TextField
          style={{width: '100%'}}
          name="passphrase"
          type="password"
          hintText="Fill in your passphrase"
          onChange={(e, value) => this.setState({passphrase: value})}
          />
      </div>
    )
  }
  
  render() {
    const {loggedIn} = this.props;
    console.log('loggedIn', loggedIn, this.state.loggedIn);
    const actions = [
      <RaisedButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Login"
        primary={true}
        onClick={this.handleLogin}
      />,
    ];
    
    return (
      <div>
      <Paper style={paperStyle}>
        <List style={{margin:0, padding: 0}}>
          <Subheader style={{padding: 0, margin: 0}}>Your wallets</Subheader>
          <Divider />
          {this.props.wallets.map((wallet, index) => {
            return <ListItem key={index} primaryText={wallet.name} onClick={this.handleWalletClick.bind(this, wallet)} style={listItemStyle} leftIcon={<AccountBalanceWallet />} />
          })}
        </List>
      </Paper>
        <Dialog
          title="Fill in your passphrase"
          actions={actions}
          modal={true}
          open={this.state.open}
          style={{justifyContent: 'center', textAlign: 'center'}}
        >
          {this.state.loggingIn ? this.loadingIndicator() : this.login()}
        </Dialog>
      </div>
    )
  }
}

WalletList.propTypes = {
  wallets: PropTypes.array.isRequired,
};

const WalletContainer =  createContainer(() => {
  return {
    wallets: Wallets.find({}).fetch(),
  };
}, WalletList);

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn,
  wif: state.account.wif,
  wallet: state.account.wallet
});

WalletList = connect(mapStateToProps)(WalletContainer);

export default WalletList;