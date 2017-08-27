import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {decrypt} from '/imports/cipher';
import { login } from '/imports/modules/account';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import { connect } from 'react-redux';
import { Link } from 'react-router';


const paperStyle = {
  marginTop: '3vh',
  marginBottom: '3vh',
  paddingTop: 0
};

const listItemStyle = {
  textAlign: 'left'
};

class WalletList extends Component {
  
  constructor() {
    super();
    this.state = {
      disableLoginButton: true,
      open: false,
      passphrase: '',
      wallet: {}
    }
  }
  
  handleWalletClick = wallet => {
    console.log('wallet', wallet);
    this.setState({open: true, wallet: wallet});
  };
  
  handleLogin = (e, value) => {
    const wif = decrypt(value, this.state.wallet.encrypted);
    this.props.dispatch(login(wif, this.state.wallet));
  };
  
  handleClose = () => {
    this.setState({open: false});
  };
  
  render() {
    const {loggedIn} = this.props;
    console.log('loggedIn', loggedIn, this.state.loggedIn);
    const actions = [
      <RaisedButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <Link to="/dashboard"><RaisedButton
        label="Login"
        primary={true}
        disabled={!loggedIn}
      /></Link>,
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
        >
          <div>To unlock your wallet [{this.state.wallet.name}], you will need to enter your passphrase</div>
          <TextField
            style={{width: '100%'}}
            name="passphrase"
            type="password"
            hintText="Fill in your passphrase"
            onChange={this.handleLogin}
          />
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