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
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
      active: false,
      showDeleteModal: false,
      targetWalletName: '',
      showExportModal: false
    }
  }
  
  handleWalletClick = wallet => {
    console.log('wallet', wallet);
    this.setState({open: true, wallet: wallet});
  };
  
  loginHandler = () => {
    this.setState({active: true, error: false});
    Meteor.setTimeout(() => {
      api.decrypt_wif(this.state.wallet.encrypted, this.state.passphrase).then((result) => {
        this.props.dispatch(login(result, this.state.wallet));
        hashHistory.push('/dashboard');
      }).catch(e => {
        console.log('Not logging in');
        this.setState({active: false, error: true});
      });
    }, 500);
  };
  
  handleClose = () => {
    this.setState({open: false, active: false, error: true});
  };
  
  loadingIndicator = () => {
    return <div>
      <p><strong>Loading, please wait...</strong></p>
      <RefreshIndicator
        size={80}
        left={0}
        top={0}
        status="loading"
        style={refreshStyle}
        />
    </div>;
  }
  
  loginModal() {
    return (
      <div>
        <div>To unlock your wallet [{this.state.wallet.name}], you will need to enter your passphrase</div>
        <TextField
          style={{width: '100%'}}
          name="passphrase"
          type="password"
          hintText="Fill in your passphrase"
          errorText={this.state.error ? 'Your passphrase is wrong, enter again' : ''}
          onChange={(e, value) => this.setState({passphrase: value})}
          />
      </div>
    )
  }
  
  deleteModal() {
    return (
      <div>
        <div>To delete this wallet [{this.state.targetWalletName}], you will need to enter your passphrase. <br/>
          <strong>Be aware that deleting a wallet with funds, while you don't have a copy of the private key, will result in a loss.</strong></div>
        <TextField
          style={{width: '100%'}}
          name="passphrase"
          type="password"
          hintText="Fill in your passphrase"
          errorText={this.state.error ? 'Your passphrase is wrong, enter again' : ''}
          onChange={(e, value) => this.setState({passphrase: value})}
        />
      </div>
    )
  }
  
  exportModal() {
    return (
      <div>
        <div>You can export this wallet [{this.state.targetWalletName}] to import it at another device, your export will be encrypted by your passphrase.</div>
        <TextField
          style={{width: '100%'}}
          name="passphrase"
          type="password"
          hintText="Fill in your passphrase"
          errorText={this.state.error ? 'Your passphrase is wrong, enter again' : ''}
          onChange={(e, value) => this.setState({passphrase: value})}
          />
      </div>
    )
  }
  
  deleteHandler = () => {
    console.log('deleting wallet');
    this.setState({active: true});
    Meteor.setTimeout(() => {
      const wallet = Wallets.findOne({name: this.state.targetWalletName});
      api.decrypt_wif(wallet.encrypted, this.state.passphrase).then((result) => {
        Wallets.remove({name: this.state.targetWalletName});
        this.setState({active: false, error: false, open: false, showDeleteModal: false});
      }).catch(e => {
        console.log('error', e);
        this.setState({active: false, error: true});
      });
    }, 500);
  };
  
  exportHandler = (data) => {
    console.log(data);
    
  };
  
  rightIconMenu = (name) => {
    
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon />
      </IconButton>
    );
    
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={() => this.setState({targetWalletName: name, showExportModal: true, open: true})}>Export</MenuItem>
        <MenuItem onClick={() => this.setState({targetWalletName: name, showDeleteModal: true, open: true})}>Delete</MenuItem>
      </IconMenu>
    );
  };
  
  getModal = () => {
    if(this.state.showExportModal) return this.exportModal();
    if(this.state.showDeleteModal) return this.deleteModal();
    return this.loginModal();
  };
  
  getModalConfirmHandle = () => {
    if(this.state.showExportModal) return this.exportHandler;
    if(this.state.showDeleteModal) return this.deleteHandler;
    return this.loginHandler;
  };
  
  render() {
    const {loggedIn} = this.props;
    const actions = [
      <RaisedButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Confirm"
        primary={true}
        onClick={this.getModalConfirmHandle()}
      />,
    ];
    
    return (
      <div>
      <Paper style={paperStyle}>
        <List style={{margin:0, padding: 0}}>
          <Subheader style={{padding: 0, margin: 0}}>Your wallets</Subheader>
          <Divider />
          {this.props.wallets.length === 0 ? 'You have no wallets configured': ''}
          {this.props.wallets.map((wallet, index) => {
            return <ListItem key={index} primaryText={wallet.name} onClick={this.handleWalletClick.bind(this, wallet)} style={listItemStyle} leftIcon={<AccountBalanceWallet />} rightIconButton={this.rightIconMenu(wallet.name)} />
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
          {this.state.active && !this.state.error ? this.loadingIndicator() : this.getModal()}
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