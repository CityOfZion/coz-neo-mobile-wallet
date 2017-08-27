import React, {Component} from 'react';
import {connect} from 'react-redux';
import {newWallet} from '/imports/modules/generateWallet';
import {Link} from 'react-router';
import QRCode from 'qrcode';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import CopyToClipboard from 'react-copy-to-clipboard';
import SaveWallet from "./subcomponents/SaveWallet";

const generateWallet = (dispatch) => {
  dispatch(newWallet());
};

const paperStyle = {
  marginTop: '3vh',
  marginBottom: '3vh',
  paddingTop: '2vh'
};

class CreateWallet extends Component {
  
  constructor() {
    super();
    this.state = {
      copiedPrivKey: false,
      copiedPubKey: false
    }
  }
  
  componentDidMount = () => {
    generateWallet(this.props.dispatch);
  };
  
  componentDidUpdate = () => {
    QRCode.toCanvas(this.publicCanvas, this.props.address, {version: 5}, (err) => {
      if (err) console.log(err)
    });
    QRCode.toCanvas(this.privateCanvas, this.props.wif, {version: 5}, (err) => {
      if (err) console.log(err)
    });
  };
  
  render = () =>
    <div id="newWallet">
      <Paper style={paperStyle}>
        <div className="disclaimer">
          Save the keys below. We will never show you this private key again.
        </div>
        <div className="addressBox">
          <div>Public Address</div>
          <canvas ref={(node) => this.publicCanvas = node}></canvas>
        </div>
        <div className="privateKeyBox">
          <div>Private Key (WIF)</div>
          <canvas ref={(node) => this.privateCanvas = node}></canvas>
        </div>
      </Paper>
      <Paper style={paperStyle}>
        <div className="keyList">
          <span className="label">Public Address:</span><br/>
          <span>
          <CopyToClipboard
            text={this.props.address}
            onCopy={() => this.setState({copiedPubKey: true})}>
        <span><RaisedButton
          label={this.state.copiedPubKey ? "Copied public key" : "Copy public key"}
          primary={!this.state.copiedPubKey}
          secondary={this.state.copiedPubKey}
        /></span>
      </CopyToClipboard>
        </span>
          <span className="key">
          <TextField
            multiLine={true}
            name="pubKey"
            rows={2}
            style={{"width": "90vw"}}
            value={this.props.address || ''}
            disabled={true}
          /></span>
        </div>
        <div className="keyList">
          <span className="label">Private Key:</span><br/>
          <span>
          <CopyToClipboard
            text={this.props.wif}
            onCopy={() => this.setState({copiedPrivKey: true})}>
        <RaisedButton
          label={this.state.copiedPrivKey ? "Copied private key" : "Copy private key"}
          primary={!this.state.copiedPrivKey}
          secondary={this.state.copiedPrivKey}
        />
      </CopyToClipboard>
        </span>
          <span className="key">
          <TextField
            multiLine={true}
            name="privKey"
            rows={2}
            style={{"width": "90vw"}}
            value={this.props.wif || ''}
            disabled={true}
          /></span>
        </div>
      </Paper>
      <SaveWallet/>
      <Link to="/">
        <RaisedButton
        label="Back to Login"
        fullWidth={true}
        primary={true}
        />
      </Link>
    </div>;
  
}

const mapStateToProps = (state) => ({
  wif: state.generateWallet.wif,
  address: state.generateWallet.address
});

CreateWallet = connect(mapStateToProps)(CreateWallet);

export default CreateWallet;
