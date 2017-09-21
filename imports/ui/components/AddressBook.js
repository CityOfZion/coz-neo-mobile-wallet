import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ContactMail from 'material-ui/svg-icons/communication/contact-mail'
import { connect } from 'react-redux';
import {doSendAsset, verifyAddress} from 'neon-js';
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

class AddressBook extends Component {
  
  constructor() {
    super();
    this.state = {
      showNewAddressModal: false,
      newAddressName: '',
      newAddress: '',
      nameError: '',
      addressError: '',
      deleteAddressModal: false,
      address: {},
      active: false,
      showDeleteModal: false,
      targetAddressName: ''
    }
  }
  
  verifyPublicAddress = address => {
    console.log('address', address);
    try {
      if (verifyAddress(address) !== true) {
        this.setState({
          addressError: "The address you entered is not valid."
        });
      } else {
        this.setState({
          addressError: false,
          newAddress: address
        });
      }
    } catch (e) {
      this.setState({
        addressError: "The address you entered is not valid."
      });
      console.log('error1');
    }
  };
  
  verifyName = name => {
    if(name === '') {
      this.setState({nameError: 'The name can not be empty'});
      return false;
    }
    
    if(Addresses.find({name: name}).count() > 0) {
      this.setState({nameError: 'This name already exists'});
      return false;
    }
    
    this.setState({newAddressName: name, nameError: false});
  };
  
  handleAddressClick = address => {
    console.log('address', address);
    this.setState({open: true, address: address});
  };
  
  handleClose = () => {
    this.resetData();
  };
  
  addModal() {
    return (
      <div>
        <div>To add a wallet fill in a name and the address, please triple check if the address is okay!</div>
        <TextField
          style={{width: '100%'}}
          name="name"
          hintText="Fill in a name"
          errorText={this.state.nameError === false ? '' : this.state.nameError}
          onChange={(e, value) => this.verifyName(value)}
        />
        <TextField
          style={{width: '100%'}}
          name="name"
          hintText="Fill in the public address"
          errorText={this.state.addressError === false ? '' : this.state.addressError}
          onChange={(e, value) => this.verifyPublicAddress(value)}
        />
      </div>
    )
  }
  
  deleteModal() {
    return (
      <div>
        <div>Are you sure you want to delete [{this.state.targetAddressName}]?</div>
      </div>
    )
  }
  
  deleteAddress = () => {
    console.log('deleting address');
    Addresses.remove({name: this.state.targetAddressName});
    this.setState({showDeleteModal: false});
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
        <MenuItem onClick={() => this.setState({targetAddressName: name, showDeleteModal: true})}>Delete</MenuItem>
      </IconMenu>
    );
  };
  
  resetData() {
    this.setState({
      newAddress: false,
      newAddressName: false,
      addressError: '',
      nameError: '',
      showNewAddressModal: false
    });
  }
  
  saveAddress = () => {
    const id = Addresses.insert({
      name: this.state.newAddressName,
      address: this.state.newAddress
    });
    
    if(id) {
      this.resetData();
    } else {
      console.log('error saving address');
    }
    
  }
  
  render() {
    const actions = [
      <RaisedButton
        fullWidth={true}
        label="Cancel"
        secondary={true}
        onClick={e => this.handleClose()}
      />,
      <RaisedButton
        fullWidth={true}
        label="Confirm"
        primary={true}
        disabled={this.state.addressError !== false || this.state.nameError !== false}
        onClick={e => this.saveAddress()}
      />,
    ];
    
    const deleteActions = [
      <RaisedButton
        fullWidth={true}
        label="Cancel"
        secondary={true}
        onClick={e => this.handleClose()}
      />,
      <RaisedButton
        fullWidth={true}
        label="Confirm"
        primary={true}
        onClick={e => this.deleteAddress()}
      />,
    ];
    
    return (
      <div>
        <RaisedButton
          label="Back"
          primary={true}
          onClick={e => hashHistory.push('/dashboard')}
        />
        <Paper style={paperStyle}>
          <RaisedButton
            label="Add address"
            primary={true}
            fullWidth={true}
            onClick={e => this.setState({showNewAddressModal: true})}
          />
          <List style={{margin:0, padding: 0}}>
            <Subheader style={{padding: 0, margin: 0, textAlign: 'center'}}>Your addresses</Subheader>
            <Divider />
            {this.props.addresses.length === 0 ? 'You have no addresses configured': ''}
            {this.props.addresses.map((address, index) => {
              return <ListItem key={index} primaryText={address.name} onClick={() => this.handleAddressClick(address)} style={listItemStyle} leftIcon={<ContactMail />} rightIconButton={this.rightIconMenu(address.name)} />
            })}
          </List>
        </Paper>
        <Dialog
          title="Add new address"
          actions={actions}
          modal={true}
          open={this.state.showNewAddressModal}
          style={{justifyContent: 'center', textAlign: 'center'}}
        >
          {this.addModal()}
        </Dialog>
        <Dialog
          title="Delete address"
          actions={deleteActions}
          modal={true}
          open={this.state.showDeleteModal}
          style={{justifyContent: 'center', textAlign: 'center'}}
        >
          {this.deleteModal()}
        </Dialog>
        <RaisedButton
          label="Back"
          primary={true}
          onClick={e => hashHistory.push('/dashboard')}
        />
      </div>
    )
  }
}

AddressBook.propTypes = {
  addresses: PropTypes.array.isRequired,
};

const AddressBookContainer =  createContainer(() => {
  return {
    addresses: Addresses.find({}).fetch(),
  };
}, AddressBook);

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn
});

AddressBook = connect(mapStateToProps)(AddressBookContainer);

export default AddressBook;