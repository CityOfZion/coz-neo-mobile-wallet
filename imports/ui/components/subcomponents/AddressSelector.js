import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {doSendAsset, verifyAddress} from 'neon-js';
import MenuItem from 'material-ui/MenuItem';

/**
 * The rendering of selected items can be customized by providing a `selectionRenderer`.
 */
class AddressSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }
  
  handleChange = (event, index, value) => {
    console.log('HANDLECHANGE', value)
    this.setState({value: value});
    this.props.handleChange(value);
  };
  
  selectionRenderer = () => {
    console.log('items', this.state.value);
    return this.state.value ? this.state.value.name + ' selected' : '';
  };
  
  menuItems(addresses) {
    return addresses.map((address) => (
      <MenuItem
        key={address.name}
        insetChildren={true}
        checked={this.state.value && address.name === this.state.value.name}
        value={address}
        primaryText={address.name}
      />
    ));
  }
  
  render() {
    console.log('addressses', this.props.addresses);
    return (
      <SelectField
        multiple={false}
        hintText="Select an address"
        hintStyle={{textAlign: "left"}}
        style={{"width": "90vw"}}
        value={this.state.value || null}
        onChange={this.handleChange}
        selectionRenderer={this.selectionRenderer}
      >
        {this.menuItems(this.props.addresses)}
      </SelectField>
    );
  }
}

AddressSelector.propTypes = {
  addresses: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired
};

const AddressSelectorContainer = createContainer(() => {
  return {
    addresses: Addresses.find({}).fetch()
  };
}, AddressSelector);

export default AddressSelectorContainer;