import React, {Component} from 'react';
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

class AddressBook extends Component {
  
  constructor() {
    super();
    this.state = {
    }
  }
  
  render() {
    return '';
  }

}

export default AddressBook;
