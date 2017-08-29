import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {hashHistory} from 'react-router';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import CopyToClipboard from 'react-copy-to-clipboard';

const style = {
  marginTop: '12vh'
};

export default class LeftMenu extends Component {
  constructor() {
    super();
    this.state = {
      showConfirmNew: false,
      donateModal: false,
      copiedKey: false
    };
  }
  
  render() {
  
    const actions = [
      <RaisedButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <Link to="/create"><RaisedButton
        label="Confirm"
        primary={true}
      /></Link>,
    ];
    
    const {handleMenuToggle, open} = this.props;
    return (
      <div>
        <Dialog
          modal={false}
          open={this.state.donateModal}
          style={{justifyContent: 'center', textAlign: 'center'}}
        >
          <p><strong>If you want to donate you are welcome to send it to totalvamp: AaGw1zYyqGVcjZVE25VSy6749XoEUWkhb3</strong></p>
          <CopyToClipboard
            text="AaGw1zYyqGVcjZVE25VSy6749XoEUWkhb3"
            onCopy={() => this.setState({copiedKey: true})}>
            <span>
              <RaisedButton
                label={this.state.copiedKey ? "Copied address" : "Copy address"}
                primary={!this.state.copiedKey}
                secondary={this.state.copiedKey}
              />
          </span>
          </CopyToClipboard>
        </Dialog>
        <Dialog
          title="Do you want to create a new wallet?"
          actions={actions}
          modal={true}
          open={this.state.showConfirmNew}
        />
        <Drawer
          open={open}
          docked={false}
          containerStyle={style}
          onRequestChange={(open) => handleMenuToggle()}
        >
          <MenuItem target="create" value="create" onClick={() => hashHistory.push('/create')}>Create wallet</MenuItem>
          <MenuItem value="donate" onClick={e => setState({donateModal: true})}>Donate to totalvamp</MenuItem>
        </Drawer>
      </div>
    );
  }
}