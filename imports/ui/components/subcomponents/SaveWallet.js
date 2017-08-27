import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {encrypt} from '/imports/cipher';

const paperStyle = {
  marginTop: '3vh',
  marginBottom: '3vh',
  paddingTop: '2vh'
};

class SaveWallet extends Component {
  
  constructor() {
    super();
    this.state = {
      passphrase: '',
      passphraseRepeat: '',
      walletName: '',
      walletSaved: false,
      walletExists: false,
      saveButtonDisabled: true
    }
  }
  
  componentDidUpdate() {
    this.saveButtonDisabled();
  };
  
  saveWallet = () => {
    console.log(this.state.walletName, this.state.passphrase, this.props.wif);
    const encrypted = encrypt(this.state.passphrase, this.props.wif);
    const id = Wallets.insert({
      name: this.state.walletName,
      encrypted: encrypted,
      public: this.props.address
    });
    
    if (id) {
      this.setState({walletSaved: true});
    }
    
    console.log(Wallets.find({}).fetch());
  };
  
  saveButtonDisabled() {
    let disabled = false;
    
    if (this.state.passphrase !== this.state.passphraseRepeat) disabled = true;
    if (this.state.passphrase.length === 0) disabled = true;
    if (this.state.walletName.length === 0) disabled = true;
    if (this.state.walletSaved) disabled = true;
    
    const walletExists = Wallets.find({name: this.state.walletName}).count() === 1;
    
    if (walletExists) disabled = true;
    
    if (walletExists !== this.state.walletExists) this.setState({walletExists: walletExists});
    if (this.state.saveButtonDisabled !== disabled) this.setState({saveButtonDisabled: disabled});
  }
  
  render() {
    return (
      <Paper style={paperStyle}>
        <strong>To use this wallet, save it with a secure passphrase.</strong>
        <TextField
          hintText="Name of the wallet"
          name="walletName"
          style={{"width": "90vw"}}
          onChange={(o, value) => this.setState({walletName: value})}
          disabled={this.state.walletSaved}
          errorText={this.state.walletExists && !this.state.walletSaved ? "A wallet with this name already exists" : ''}
        />
        <TextField
          hintText="Passphrase"
          name="passphrase"
          type="password"
          style={{"width": "90vw"}}
          disabled={this.state.walletSaved}
          onChange={(o, value) => this.setState({passphrase: value})}
        />
        <TextField
          hintText="Repeat"
          name="passphraseRepeat"
          type="password"
          style={{"width": "90vw"}}
          disabled={this.state.walletSaved}
          errorText={this.state.passphrase !== this.state.passphraseRepeat ? 'Passphrases do not match' : false}
          onChange={(o, value) => this.setState({passphraseRepeat: value})}
        />
        <RaisedButton
          label={this.state.walletSaved ? "Your wallet was saved" : "Save wallet"}
          secondary={true}
          disabled={this.state.saveButtonDisabled}
          fullWidth={true}
          onClick={this.saveWallet}
        />
      </Paper>
    )
  }
}

const mapStateToProps = (state) => ({
  wif: state.generateWallet.wif,
  address: state.generateWallet.address
});

SaveWallet = connect(mapStateToProps)(SaveWallet);

export default SaveWallet;