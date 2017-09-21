import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as api from 'neon-js';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const refreshStyle = {
  display: 'inline-block',
  position: 'relative'
};

class ConfirmPassphraseModal extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      passphrase: '',
      error: '',
      active: false
    }
  }
  
  loadingIndicator(label) {
    return <div>
      <p><strong>label</strong></p>
      <RefreshIndicator
        size={80}
        left={0}
        top={0}
        status="loading"
        style={refreshStyle}
      />
    </div>;
  }
  
  handleClose = () => {
    this.setState({open: false});
  };
  
  render() {
    const {callback, confirmLabel, loadingLabel, wif, title} = this.props;
  
    const actions = [
      <RaisedButton
        fullWidth={true}
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        fullWidth={true}
        label={confirmLabel}
        primary={true}
        onClick={callback}
      />,
    ];
    
    return <Dialog
      title={title}
      actions={actions}
      modal={true}
      open={this.state.confirmWindow}
      style={{justifyContent: 'center', textAlign: 'center'}}
    >
      <div>If you are sure you want to send <strong>{this.state.targetAmount} {this.state.currency}</strong> to <strong>{this.state.targetAddress}</strong>?
      </div>
      <div>If so, enter your passphrase below to confirm.</div>
      {this.state.active ? this.loadingIndicator(loadingLabel) : ''}
      <TextField
        style={{width: '100%'}}
        name="passphrase"
        type="password"
        errorText={this.state.error}
        hintText="Fill in your passphrase"
        onChange={(e, value) => this.setState({passphrase: value})}
      />
    </Dialog>
  }
}

ConfirmPassphraseModal.propTypes = {
  title: PropTypes.string,
  callback: PropTypes.func,
  confirmLabel: PropTypes.string,
  loadingLabel: PropTypes.string,
  wif: PropTypes.string
};