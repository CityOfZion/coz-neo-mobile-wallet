import React, {Component} from 'react';
import {connect} from 'react-redux';
import {doSendAsset, verifyAddress} from 'neon-js';
import {sendEvent, clearTransactionEvent, toggleAsset} from '/imports/modules/transactions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Balance from "../subcomponents/Balance";
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import * as api from 'neon-js';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
  toggle: {
    height: '15vh',
    width: '60vw',
    margin: 20,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};
const refreshStyle = {
  display: 'inline-block',
  position: 'relative'
};

class Send extends Component {
  constructor() {
    super();
    
    this.state = {
      currency: 'Neo',
      confirmWindow: false,
      targetAddress: '',
      targetAmount: '',
      targetAddressError: false,
      targetAmountError: false,
      formValid: false,
      enteredValidPassphrase: false,
      passphrase: '',
      validatingPassphrase: false,
      sendError: ''
    };
  }
  
  handleClose = () => {
    this.setState({confirmWindow: false});
  };
  
  toggleAsset = () => {
    this.setState({currency: (this.state.currency === 'Neo' ? 'Gas' : 'Neo')});
  };
  
  validateAddress = (obj, address) => {
    console.log(address);
    try {
      if (verifyAddress(address) !== true) {
        this.setState({
          targetAddressError: "The address you entered was not valid.",
          formValid: false
        });
        console.log('error');
        setTimeout(() => clearTransactionEvent(), 5000);
      }
    } catch (e) {
      this.setState({
        targetAddressError: "The address you entered was not valid.",
        formValid: false
      });
      console.log('error1');
      
      setTimeout(() => clearTransactionEvent(), 5000);
    }
  };
  
  validateAmount = (obj, amount) => {
    const {neo, gas} = this.props;
    if (this.state.currency === "Neo" && parseFloat(amount) !== parseInt(amount)) {
      this.setState({
        targetAmountError: "You cannot send fractional amounts of Neo.",
        formValid: false
      });
      setTimeout(() => clearTransactionEvent(), 5000);
      return false;
    }
    else if (this.state.currency === "Neo" && parseInt(amount) > neo) {
      this.setState({
        targetAmountError: "You do not have enough NEO to send.",
        formValid: false
      });
      setTimeout(() => clearTransactionEvent(), 5000);
      return false;
    }
    else if (this.state.currency === "Gas" && parseFloat(amount) > gas) {
      this.setState({
        targetAmountError: "You do not have enough GAS to send.",
        formValid: false
      });
      setTimeout(() => clearTransactionEvent(), 5000);
      return false;
    }
    // check for negative this.state.currency
    else if (parseFloat(amount) < 0) {
      this.setState({
        targetAmountError: "You cannot send negative amounts of an this.state.currency.",
        formValid: false
      });
      setTimeout(() => clearTransactionEvent(), 5000);
    }
  };
  
  handlePassphraseConfirmation = () => {
    
    this.setState({validatingPassphrase: true});
    
    Meteor.setTimeout(() => {
      api.decrypt_wif(this.state.wallet.encrypted, this.state.passphrase).then((result) => {
        this.sendTransaction();
      }).catch(() => {
        this.setState({sendError: 'Your passphrase is incorrect, please try again'});
        this.setState({validatingPassphrase: false});
      });
    }, 500);
  };
  
  // perform send transaction
  sendTransaction = () => {
    doSendAsset(this.props.net, this.state.targetAddress, this.props.wif, this.state.currency, this.state.targetAmount).then((response) => {
      if (response.result === undefined) {
        this.props.dispatch(sendEvent(false, "Transaction failed!"));
      } else {
        this.props.dispatch(sendEvent(true, "Transaction complete! Your balance will automatically update when the blockchain has processed it."));
      }
      setTimeout(() => this.props.dispatch(clearTransactionEvent()), 5000);
      this.setState({validatingPassphrase: false});
  
    }).catch((e) => {
      this.setState({validatingPassphrase: false});
      this.props.dispatch(sendEvent(false, "Transaction failed!"));
      setTimeout(() => this.props.dispatch(clearTransactionEvent()), 5000);
    });
  };
  
  loadingIndicator() {
    return (<div>
      <p><strong>Checking passphrase, please wait...</strong></p>
      <RefreshIndicator
        size={80}
        left={0}
        top={0}
        status="loading"
        style={refreshStyle}
      />
    </div>)
  }
  
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Confirm"
        primary={true}
        disabled={this.state.validatingPassphrase}
        onclick={this.handlePassphraseConfirmation}
      />
    ];
    
    return (
      <div id="sendPane">
        <Dialog
          title="Confirm sending funds"
          actions={actions}
          modal={true}
          open={this.state.confirmWindow}
          style={{justifyContent: 'center', textAlign: 'center'}}
        >
          <div>If you are sure you want to send {this.state.targetAmount} in {this.state.currency}
            to {this.state.targetAddress}?
          </div>
          <div>If so, enter your passphrase below to confirm.</div>
          {this.state.validatingPassphrase ? this.loadingIndicator() : ''}
          <TextField
            style={{width: '100%'}}
            name="passphrase"
            type="password"
            errorText={this.state.sendError}
            hintText="Fill in your passphrase"
            onChange={(e, value) => this.setState({passphrase: value})}
          />
        </Dialog>
        <Balance/>
        <Paper style={styles.toggle} zDepth={1}>
          <div style={{order: 1, fontSize: '3em'}}>{this.state.currency}</div>
          <RaisedButton
            label={`Change to ${this.state.currency === 'Neo' ? 'Gas' : 'Neo'}`}
            fullWidth={true}
            primary={this.state.currency === 'Neo'}
            secondary={this.state.currency === 'Gas'}
            onClick={this.toggleAsset}
            style={{order: 2}}
          />
        </Paper>
        <div id="sendAddress">
          <TextField
            hintText="Put in a valid NEO address"
            floatingLabelText="Where to send the asset (address)"
            style={{"width": "90vw"}}
            errorText={this.state.targetAddressError}
            onChange={this.validateAddress}
          />
        </div>
        <div id="sendAmount">
          <TextField
            hintText={`How much ${this.state.currency} do you want to send?`}
            floatingLabelText={`How many ${this.state.currency} do you want to send?`}
            style={{"width": "90vw"}}
            errorText={this.state.targetAmountError}
            onChange={this.validateAmount}
          />
        </div>
        <div id="sendButton">
          <RaisedButton
            label="Open confirmation window"
            fullWidth={true}
            primary={true}
            disabled={!this.state.formValid}
            onClick={() => this.setState({confirmWindow: true})}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  wif: state.account.wif,
  wallet: state.account.wallet,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  selectedAsset: state.transactions.selectedAsset,
  confirmPane: state.dashboard.confirmPane
});

Send = connect(mapStateToProps)(Send);

export default Send;
