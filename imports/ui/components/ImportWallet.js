import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import QRCode from 'qrcode';
import {importWallet} from '/imports/modules/generateWallet';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import CopyToClipboard from 'react-copy-to-clipboard';
import SaveWallet from "./subcomponents/SaveWallet";

const paperStyle = {
  marginTop: '3vh',
  marginBottom: '3vh',
  paddingTop: '2vh'
};

class ImportWallet extends Component {
  
  constructor() {
    super();
    this.state = {
      wif: '',
      address: '',
      publicCanvas: false,
      privateCanvas: false,
      
    }
  }
  
  handleChange = value => {
    this.props.dispatch(importWallet(value));
    if (this.props.address) {
      this.setState({address: this.props.address})
    }
  };
  
  componentDidUpdate = () => {
    if (this.props.address) {
      QRCode.toCanvas(this.publicCanvas, this.props.address, {version: 5}, (err) => {
        if (err) console.log(err)
      });
      QRCode.toCanvas(this.privateCanvas, this.props.wif, {version: 5}, (err) => {
        if (err) console.log(err)
      });
    }
  };
  
  qrCodes = () => {
    return (
      <div>
        <div className="addressBox">
          <div>Public Address</div>
          <canvas ref={(node) => this.publicCanvas = node}></canvas>
        </div>
        <div className="privateKeyBox">
          <div>Private Key (WIF)</div>
          <canvas ref={(node) => this.privateCanvas = node}></canvas>
        </div>
      </div>
    )
  };
  
  render = () =>
    <div id="importWallet">
      <Paper style={paperStyle}>
        <div className="disclaimer">
          For now this wallet only supports importing a private key.
        </div>
        <div className="privateKey">
          <TextField
            multiLine={true}
            hintText="Fill in your private key(WIF) here"
            name="privKey"
            rows={2}
            style={{"width": "90vw"}}
            onChange={(e, value) => this.handleChange(value)}
          />
        </div>
        {this.props.address ? this.qrCodes() : ''}
      </Paper>
      <div style={{display: this.props.address ? 'block' : 'none'}}>
        <Paper style={paperStyle}>
          <div className="keyList">
            <span className="label">Public Address:</span><br/>
            <span>
              <CopyToClipboard
                text={this.props.address}
                onCopy={() => this.setState({copiedPubKey: true})}>
                <span>
                  <RaisedButton
                    label={this.state.copiedPubKey ? "Copied public key" : "Copy public key"}
                    primary={!this.state.copiedPubKey}
                    secondary={this.state.copiedPubKey}
                  />
                </span>
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
            />
            </span>
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
              />
            </span>
          </div>
        </Paper>
      <SaveWallet/>
    </div>
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

ImportWallet = connect(mapStateToProps)(ImportWallet);

export default ImportWallet;
