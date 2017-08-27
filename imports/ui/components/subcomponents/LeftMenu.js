import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {browserHistory} from 'react-router';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

const style = {
  marginTop: '12vh'
};

export default class LeftMenu extends Component {
  constructor() {
    super();
    this.state = {
      showConfirmNew: false
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
          <MenuItem target="create" value="create" onClick={() => browserHistory.push('/create')}>Create wallet</MenuItem>
          <MenuItem><Link to="/">Open wallet</Link></MenuItem>
          <MenuItem value="donate" onClick={() => browserHistory.push('/donate')}>Donate to totalvamp</MenuItem>
        </Drawer>
      </div>
    );
  }
}